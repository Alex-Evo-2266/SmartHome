import React,{useEffect,useState,useCallback,useContext} from 'react'
import {DeviceStatusContext} from '../context/DeviceStatusContext'
import {AuthContext} from '../context/AuthContext.js'
import {useHttp} from '../hooks/http.hook'

export const SocketState = ({socket,children}) =>{
  const auth = useContext(AuthContext)
  const [cost, setCost] = useState(true)
  const [devices, setDevices] = useState([]);
  const [connect, setConnect] = useState(false)
  const [interval, setInterval] = useState(2)
  const {request, error, clearError} = useHttp();

  const updateDevice=()=>{
    if(connect)
      socket.send(JSON.stringify({
        'message': "all"
      }))
  }

  const importCarts = useCallback(async()=>{
    try {
      const data2 = await request(`/api/server/config`, 'GET', null,{Authorization: `Bearer ${auth.token}`})
      setInterval(data2.server.updateFrequency)
    } catch (e) {
      console.error(e);
    }
  },[request,auth.token])

  useEffect(()=>{
    updateDevice()
    importCarts()
    return () => {
      return socket.onmessage = null
    }
  },[])

  useEffect(() => {
    const interval2 = setTimeout(() => {
      updateDevice()
      setCost((prev)=>!prev)
    }, interval*1000);
    return () => {
      console.log("break");
      return clearTimeout(interval2);
    }
  },[cost,interval]);

  socket.onopen = function() {
    console.log("connect");
    setConnect(true)
    socket.onmessage = function(e) {
        const data = JSON.parse(e.data);
        console.log(data);
        setCost((prev)=>!prev)
        setDevices(data.message)
    };
  }

  if(!socket)
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
