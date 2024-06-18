import './index.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import {createHashRouter, RouterProvider} from "react-router-dom";
import {Dashboard} from "./components/dashboard";
import {Layout} from "./components/layout";
import {darkTheme, Provider} from "@adobe/react-spectrum";
import {PlatformConfiguration} from "./components/platform-configuration";
import {DeviceProvider} from "./hooks/use-device";

const router = createHashRouter([{
  path: '/',
  element: <Layout/>,
  children: [{
    path: '/',
    element: <Dashboard/>,
  }, {
    path: '/platform-configuration/:providerName',
    element: <PlatformConfiguration/>
  }]
}])


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Provider theme={darkTheme} colorScheme="dark" height={'100vh'}>
      <DeviceProvider>
        <RouterProvider router={router}/>
      </DeviceProvider>
    </Provider>
  </React.StrictMode>
)
