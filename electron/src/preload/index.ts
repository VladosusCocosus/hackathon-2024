import { contextBridge, ipcRenderer } from 'electron'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', {
      ...electronAPI,
      onUpdatePNL: (callback) => ipcRenderer.on('pnl:update', (_event, value) => callback(value)),
      onUpdateDevice: (callback) => ipcRenderer.on('device:update', (_event, value) => callback(value))
    })
    contextBridge.exposeInMainWorld('api', api)
    contextBridge.exposeInMainWorld('store', {
        get(key: string) {
          return ipcRenderer.sendSync('store-get', key);
        },
        set(property: string, val: unknown) {
          ipcRenderer.send('store-set', property, val);
        },
    });
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}
