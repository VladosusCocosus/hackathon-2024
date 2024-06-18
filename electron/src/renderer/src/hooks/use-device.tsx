import {createContext, ReactNode, useContext, useState} from "react";


export interface DeviceContext  {
  connected: boolean,
  name: string | null
}

const DeviceContext = createContext<DeviceContext>({
  connected: false,
  name: null
})

interface Props {
  children: ReactNode
}

export function DeviceProvider ({children}: Props) {
  const [state, setState] = useState<DeviceContext>({
    connected: false,
    name: null
  })

  window.electron.onUpdateDevice((value) => setState(value))

  return (
    <DeviceContext.Provider value={state}>
      {children}
    </DeviceContext.Provider>
  )
}

export function useDevice() {
  return useContext(DeviceContext)
}
