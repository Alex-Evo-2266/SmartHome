import React,{useEffect,useState,useCallback,useContext,useRef} from 'react'
import {DeviceStatusContext} from '../context/DeviceStatusContext'
import {AuthContext} from '../context/AuthContext.js'
import {useHttp} from '../hooks/http.hook'

export const SocketState = ({children}) =>{
  const auth = useContext(AuthContext)
  const [cost, setCost] = useState(true)
  const [devices, setDevices] = useState([]);
  const socket = useRef(null);
  const timerId = useRef(null);
  const [connect, setConnect] = useState(false)
  const [interval, setInterval2] = useState(2)
  const {request} = useHttp();

  const updateDevice = useCallback(()=>{
    if(connect){
      try {
        socket.current.send(JSON.stringify({
          'message': "all"
        }))
      } catch (e) {
        console.error(e.message);
      }
    }
    else{

    }
  },[connect])

  const importCarts = useCallback(async()=>{
    try {
      const data2 = await request(`/api/server/config`, 'GET', null,{Authorization: `Bearer ${auth.token}`})
      setInterval2(data2.updateFrequency)
    } catch (e) {
      console.error(e);
    }
  },[request,auth.token])

  const listenChanges = useCallback(() => {

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
        clearInterval(timerId.current);
        setConnect(true)

        socket.current.onmessage = function(e) {
              const data = JSON.parse(e.data);
              setCost((prev)=>!prev)
              if(data.message instanceof Array)
                setDevices(data.message)
          };

        socket.current.onerror = () => {
            socket.current.close();
        };

        socket.current.onclose = () => {
          console.log("desconnect");
          setConnect(false)
            timerId.current = setInterval(() => {
                listenChanges();
            }, 10000);
        };
    };
},[])

useEffect(()=>{
  listenChanges()
  importCarts()
  return () => {
    return socket.current.close()
  }
},[importCarts,listenChanges])

useEffect(()=>{
  if(connect)
    updateDevice()
},[updateDevice,connect])

useEffect(() => {
  const interval2 = setTimeout(() => {
    updateDevice()
    setCost((prev)=>!prev)
  }, interval*1000);
  return () => {
    return clearTimeout(interval2);
  }
},[cost,interval,updateDevice]);


  if(!socket.current)
    return(
      <h1>error</h1>
    )

  return(
    <DeviceStatusContext.Provider value={{
      devices:devices,
      updateDevice
    }}>
      {children}
    </DeviceStatusContext.Provider>
  )
}
