import React,{useEffect,useState,useCallback,useContext,useRef} from 'react'
import {SocketContext} from '../context/SocketContext'
import {AuthContext} from '../context/AuthContext.js'

export const SocketState = ({children}) =>{
  const auth = useContext(AuthContext)
  const [devices, setDevices] = useState([]);
  const [message, setMessage] = useState({});
  const socket = useRef(null);
  const timerId = useRef(null);

  const connect = useCallback(()=>{
    try {

      // let path = `ws://${window.location.host}/ws/base`
      // let path = `ws://localhost:5000/ws/base`
      console.log(process.env.REACT_APP_WS_HOST);
      let path = `ws://${process.env.REACT_APP_WS_HOST}/ws/base`

      // console.log(process.env.REACT_APP_WS_HOST);

      socket.current = new WebSocket(path)
    } catch (e) {
      setTimeout(function () {
        connect()
      }, 500);
    }
  },[])

  const listenChanges = useCallback(() => {
    if(!auth.isAuthenticated) return

    connect()
    if(!socket.current) return ;
    socket.current.onopen = () => {
      console.log("connect");
        clearInterval(timerId.current);

        socket.current.onmessage = function(e) {
              const data = JSON.parse(e.data);
              console.log(data.message);
              if(data.message instanceof Object){
                if(data.message.type==="devices"){
                  setDevices(data.message.data)
                }
                setMessage(data.message)
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

const getDevice = useCallback((systemName)=>{
  if(!devices||!devices[0])
    return null
  return devices.filter((item)=>(item?.systemName===systemName))[0]
},[devices])

useEffect(()=>{
  listenChanges()
  return () => {
    if(socket.current)
      return socket.current.close()
  }
},[listenChanges])

  return(
    <SocketContext.Provider value={{
      devices, message, getDevice
    }}>
      {children}
    </SocketContext.Provider>
  )
}
