import React,{useEffect,useState,useCallback,useContext,useRef} from 'react'
import {DeviceStatusContext} from '../context/DeviceStatusContext'
import {AuthContext} from '../context/AuthContext.js'

export const SocketState = ({children}) =>{
  const auth = useContext(AuthContext)
  const [devices, setDevices] = useState([]);
  const socket = useRef(null);
  const timerId = useRef(null);

  const listenChanges = useCallback(() => {
    console.log(auth.isAuthenticated);
    if(!auth.isAuthenticated) return

    socket.current = new WebSocket(
          'ws://'
          // + window.location.host
          + '127.0.0.1:5000'
          + '/ws/smartHome/'
          + 'devices'
          + '/'
      )

    socket.current.onopen = () => {
      console.log("connect");
      console.log(JSON.stringify({
        'message': "all"
      }));
        clearInterval(timerId.current);

        socket.current.onmessage = function(e) {
              const data = JSON.parse(e.data);
              if(data.message instanceof Array)
                setDevices(data.message)
          };

        socket.current.onerror = () => {
            socket.current.close();
        };

        socket.current.onclose = () => {
          console.log("desconnect");
            timerId.current = setInterval(() => {
                listenChanges();
            }, 10000);
        };
    };
},[auth.isAuthenticated])

useEffect(()=>{
  listenChanges()
  return () => {
    console.log(typeof(socket.current));
    if(socket.current)
      return socket.current.close()
  }
},[listenChanges])

  return(
    <DeviceStatusContext.Provider value={{
      devices:devices
    }}>
      {children}
    </DeviceStatusContext.Provider>
  )
}
