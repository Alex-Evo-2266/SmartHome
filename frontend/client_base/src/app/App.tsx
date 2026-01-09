import { ColorProvider, SizeProvider } from "alex-evo-sh-ui-kit";
import { useEffect } from "react";
import { BrowserRouter } from 'react-router-dom';

import { RoutesComponent } from "./routs"
import '../shared/ui/index.scss'
import { useUpdateDeviceData } from "../entites/devices/hooks/update_device_data";
import { useAppSelector } from "../shared/lib/hooks/redux";
import { useSocket } from "../shared/lib/hooks/webSocket.hook";


function App() {

  const {isAuthenticated, role} = useAppSelector(state=>state.auth)
  const {updateDevicedata, patchDeviceState} = useUpdateDeviceData()
  const {listenSocket, closeSocket} = useSocket([
      {messageType: "device-send", callback: updateDevicedata as (arg: unknown)=>void},
      {messageType: "device-send-patch", callback: patchDeviceState as (arg: unknown)=>void},
  ])

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
            <RoutesComponent isAuthenticated={isAuthenticated} role={role}/>
          </SizeProvider>
        </ColorProvider>
      </BrowserRouter>
    </>
  )
}

export default App
