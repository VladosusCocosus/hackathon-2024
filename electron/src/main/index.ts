import {app, BrowserWindow, ipcMain, shell, session} from 'electron'
import {join} from 'path'
import {electronApp, is, optimizer} from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import Store from 'electron-store';
import {Device} from "../utils/device";
import {IPCMethods} from "../types/ipc-methods";


const store = new Store() as unknown as { get: (key: string) => unknown, set: (key: string, value: unknown) => unknown };
let deviceName: string | null = null

const device = new Device((command, value) => {
  if (command === 'name') {
    deviceName = value
  }

  if (command === 'log') {
    console.log(value)
  }
})


function createWindow(): void {
  console.log(join(__dirname, '../preload/index.mjs'), process.env['ELECTRON_RENDERER_URL'])

  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      nodeIntegration: true,
      preload: join(__dirname, '../preload/index.mjs'),
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })


  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }

  let id = setInterval(async () => {
    if (!device.connected) {
     const info = await device.connect()
      if (info) {
        mainWindow.webContents.send('device:update', info)
        clearInterval(id)
      }
    }
  }, 1000)


  mainWindow.webContents.openDevTools()
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

  session.defaultSession.webRequest.onHeadersReceived(
    { urls: ['http://localhost:3000/*'] },
    (details, callback) => {
      if (
        details.responseHeaders &&
        details.responseHeaders['set-cookie'] &&
        details.responseHeaders['set-cookie'].length &&
        !details.responseHeaders['set-cookie'][0].includes('SameSite=none')
      ) {
        details.responseHeaders['set-cookie'][0] = details.responseHeaders['set-cookie'][0] + '; SameSite=none; Secure';
      }

      console.log(details.responseHeaders)

      callback({ cancel: false, responseHeaders: details.responseHeaders });
    },
  );

  session.defaultSession.cookies.get({})
    .then((cookies) => {
      console.log(cookies)
    }).catch((error) => {
    console.log(error)
  })

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  ipcMain.handle(IPCMethods.DeviceStatus, async () => {
    return {connected: device.connected, display: deviceName}
  })

  ipcMain.on('store-get', (event, key) => {
    event.returnValue = store.get(key)
  });

  ipcMain.on('store-set', (_, key, val) => {
    store.set(key, val);
  });


  setInterval(async () => {
    if (!device.connected) {
      await device.connect()

    }
  }, 5000)


  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()

  })
})



// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
