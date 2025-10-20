import { RoutesComponent } from "./routs"
import { BrowserRouter } from 'react-router-dom';
import '../shared/ui/index.scss'
import { useAppSelector } from "../shared/lib/hooks/redux";
import { useEffect } from "react";
import { useSocket } from "../shared/lib/hooks/webSocket.hook";

import { useUpdateDeviceData } from "../entites/devices/hooks/update_device_data";
import { ColorProvider, SizeProvider } from "alex-evo-sh-ui-kit";

function App() {

  const {isAuthenticated, role} = useAppSelector(state=>state.auth)
  const {updateDevicedata} = useUpdateDeviceData()
  const {listenSocket, closeSocket} = useSocket([
    {messageType: "device-send", callback: (data)=>console.log(data)},
    {messageType: "device-send", callback: updateDevicedata}
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
