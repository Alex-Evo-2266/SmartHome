import { useRoutes } from "./routs"
import { BrowserRouter } from 'react-router-dom';
import '../shared/ui/index.scss'
import { useAppSelector } from "../shared/lib/hooks/redux";
import { useEffect } from "react";
import { useSocket } from "../shared/lib/hooks/webSocket.hook";

function App() {

  const {isAuthenticated} = useAppSelector(state=>state.auth)
	const route = useRoutes(isAuthenticated)
  const {listenSocket, closeSocket} = useSocket()

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
