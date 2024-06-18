import { ElectronAPI } from '@electron-toolkit/preload'
import {PositionsInfo} from "../utils/platforms/common";


interface Electron extends ElectronAPI {
  onUpdateDevice: (callback: (value: { connected: boolean, name: string | null }) => void) => void
  onUpdatePNL: (callback: (value: PositionsInfo[] | null) => void) => void
}


declare global {
  interface Window {
    electron: Electron
    api: unknown
    store: {
      get: (key: string) => any;
      set: (key: string, val: any) => void;
      // any other methods you've defined...
    };

  }
}
