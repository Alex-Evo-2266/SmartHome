import { ColorProvider, SizeProvider } from "alex-evo-sh-ui-kit";
import { useEffect } from "react";
import { BrowserRouter } from 'react-router-dom';

import { RoutesComponent } from "./routs"
import '../shared/ui/index.scss'
import { useUpdateDeviceData } from "../entites/devices/hooks/update_device_data";
import { useAppSelector } from "../shared/lib/hooks/redux";
import { useSocket } from "../shared/lib/hooks/webSocket.hook";
import { useGetAuth } from "@src/entites/auth/hooks/auth";


function App() {

  useGetAuth()
  const {isAuthenticated, user_data } = useAppSelector(state=>state.auth)
  const {updateDevicedata, patchDeviceState} = useUpdateDeviceData()
  const {listenSocket, closeSocket} = useSocket([
      {messageType: "device-send", callback: updateDevicedata as (arg: unknown)=>void},
      {messageType: "device-send-patch", callback: patchDeviceState as (arg: unknown)=>void},
  ])

  useEffect(()=>{
    console.log(`auth data ${isAuthenticated} ${user_data}`)
  },[isAuthenticated, user_data])

  useEffect(()=>{
		if (isAuthenticated)
		  listenSocket()
		return ()=>closeSocket()
	  },[listenSocket, closeSocket, isAuthenticated])

  return (
    <>
      <BrowserRouter>
        <ColorProvider>
          <SizeProvider>
            <RoutesComponent isAuthenticated={isAuthenticated} role={user_data?.role.role_name}/>
          </SizeProvider>
        </ColorProvider>
      </BrowserRouter>
    </>
  )
}

export default App
