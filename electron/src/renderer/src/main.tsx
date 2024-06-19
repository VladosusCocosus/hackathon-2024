import './index.css'

import React from 'react'
import ReactDOM from 'react-dom/client'
import {createHashRouter, RouterProvider} from "react-router-dom";
import {Dashboard} from "./components/dashboard";
import {Layout} from "./components/layout";
import {darkTheme, Provider} from "@adobe/react-spectrum";
import {PlatformConfiguration} from "./components/platform-configuration";
import {DeviceProvider} from "./hooks/use-device";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {Login} from "./components/auth/login";
import {Registration} from "./components/auth/registration";

const router = createHashRouter([{
  path: '/',
  element: <Layout/>,
  children: [
    {
      path: '/',
      element: <Dashboard/>,
    },
    {
      path: '/auth',
      children: [
        {
          path: '/auth/login',
          element: <Login/>,
        },
        {
          path: '/auth/registration',
          element: <Registration/>,
        }
      ]

    },
    {
      path: '/platform-configuration/:providerName',
      element: <PlatformConfiguration/>
    }
  ]
}])

const queryClient = new QueryClient()


ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider theme={darkTheme} colorScheme="dark" height={'100vh'}>
        <DeviceProvider>
          <RouterProvider router={router}/>
        </DeviceProvider>
      </Provider>
    </QueryClientProvider>
  </React.StrictMode>
)
