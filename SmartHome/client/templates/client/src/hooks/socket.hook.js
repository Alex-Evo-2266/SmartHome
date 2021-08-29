import React,{useEffect,useState,useCallback,useContext,useRef} from 'react'
import {DeviceStatusContext} from '../context/DeviceStatusContext'
import {AuthContext} from '../context/AuthContext.js'

export const SocketState = ({children}) =>{
  const auth = useContext(AuthContext)
  const [devices, setDevices] = useState([]);
  const socket = useRef(null);
  const timerId = useRef(null);

  const connect = useCallback(()=>{
    try {
      socket.current = new WebSocket(
            'ws://'
            // + window.location.host
            + '127.0.0.1:5000'
            + '/ws/smartHome/'
            + 'devices'
            + '/'
        )
    } catch (e) {
      setTimeout(function () {
        connect()
      }, 500);
    }
  },[])

  const listenChanges = useCallback(() => {
    if(!auth.isAuthenticated) return

    connect()

    socket.current.onopen = () => {
      console.log("connect");
        clearInterval(timerId.current);

        socket.current.onmessage = function(e) {
              const data = JSON.parse(e.data);
              if(data.message instanceof Object){
                console.log(data.message.device);
                setDevices(data.message.device)
              }
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
},[auth.isAuthenticated,connect])

useEffect(()=>{
  listenChanges()
  return () => {
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