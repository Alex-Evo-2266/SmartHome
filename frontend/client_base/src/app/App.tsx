import { useRoutes } from "./routs"
import { BrowserRouter } from 'react-router-dom';
import '../shared/ui/index.scss'
import { useAppSelector } from "../shared/lib/hooks/redux";
import { useEffect } from "react";
import { useSocket } from "../shared/lib/hooks/webSocket.hook";

import { useUpdateDeviceData } from "../entites/devices/hooks/update_device_data";

function App() {

  const {isAuthenticated} = useAppSelector(state=>state.auth)
	const route = useRoutes(isAuthenticated)
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
        {route}
      </BrowserRouter>
    </>
  )
}

export default App
