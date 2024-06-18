import {app, BrowserWindow, ipcMain, shell} from 'electron'
import {join} from 'path'
import {electronApp, is, optimizer} from '@electron-toolkit/utils'
import icon from '../../resources/icon.png?asset'
import Store from 'electron-store';
import {Device} from "../utils/device";
import {Commands} from "../utils/device/types";
import {IPCMethods} from "../types/ipc-methods";
import {platformsAdapters} from "../utils/platforms/platform";
import {Platform, PlatformNames} from "../types/platforms";
import {Pipeline, PlatformAdapter} from "../utils/platforms/common";


const store = new Store() as unknown as { get: (key: string) => unknown, set: (key: string, value: unknown) => unknown };
let broadcast: boolean = false
let deviceName: string | null = null
let pipelines: Pipeline[] = []
let pipelineIndex = 0;

const providersInstances: Record<Partial<PlatformNames>, PlatformAdapter | undefined> = {
  [PlatformNames.circleCI]: undefined,
}

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



  setInterval(() => {
    if (pipelines.length) {
      let workflow = pipelines?.[pipelineIndex]
      if (workflow) {
        device.send(Commands.SendDisplayInfo, `$${workflow.info.name}|${workflow.info.status}`)
        pipelineIndex++
      } else {
        pipelineIndex = 0;
        workflow = pipelines[pipelineIndex]
        if (workflow) {
          device.send(Commands.SendDisplayInfo, `${workflow.info.name}|${workflow.info?.status}`)
          pipelineIndex++
        }
      }

    }
  }, 3000)

  ipcMain.handle(IPCMethods.StartBroadcast, async () => {
    if (!broadcast) {
      broadcast = true;
      setInterval(async () => {
        const platforms = store.get('platforms') as unknown as Platform[]

        const results = (await Promise.all(platforms.map((p) => {

          if (!p.accessToken?.length) {
            return null
          }

          let instance = providersInstances[p.key] ?? new platformsAdapters[p.key](p.accessToken);

          providersInstances[p.key] = instance
          try {
            return instance.getPipeline()
          } catch (e) {
            return null
          }
        }))).filter(Boolean)

        pipelines = results.reduce((acc, item) => [...(acc ?? []), ...(item ?? [])], []) ?? []

        const hasError = pipelines.some(w => ["failed", 'error'].includes(w.info.status))

        try {
          mainWindow.webContents.send('pnl:update', pipelines)

          device.send(Commands.SendPNL, hasError ?  'Wasted': 'Good')
        } catch (e) {
          console.error(e)
          device.send(Commands.SendPNL, '3')
        }
      }, 5000)
    }
  })

  mainWindow.webContents.openDevTools()
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('com.electron')

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
