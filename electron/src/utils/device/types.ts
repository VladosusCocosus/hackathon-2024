export enum Commands {
  SendPNL = 1,
  GetName = 2,
  SendDisplayInfo = 3
}


export interface DeviceContext  {
  connected: boolean,
  name: string | null
}
