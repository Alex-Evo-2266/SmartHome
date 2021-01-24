import React, {useContext,useState,useCallback,useEffect} from 'react'
import {AuthContext} from '../../../../context/AuthContext.js'
import {useHttp} from '../../../../hooks/http.hook'
import {useMessage} from '../../../../hooks/message.hook'

export const SwitchDevice = ({type,result})=>{
  const [devices, setDevices] = useState([]);
  const {message} = useMessage();
  const auth = useContext(AuthContext)
  const {request, error, clearError} = useHttp();

  const updataDevice = useCallback(async()=>{
    if(type==="script"){
      const dataScript = await request('/api/script/all', 'GET', null,{Authorization: `Bearer ${auth.token}`})
      setDevices(dataScript)
      return
    }
    const data = await request('/api/devices/all', 'GET', null,{Authorization: `Bearer ${auth.token}`})
    if(type==="button")
      setDevices(data.filter((item)=>(item.DeviceType==='light')||(item.DeviceType==='switch')||(item.DeviceType==='dimmer')||(item.DeviceType==='ir')));
    if(type==="slider")
      setDevices(data.filter((item)=>(item.DeviceType==='light')||(item.DeviceType==='dimmer')));
    if(type==="sensor")
      setDevices(data.filter((item)=>(item.DeviceType==='sensor')||(item.DeviceType==='binarySensor')));
  },[request,auth.token,type])

  useEffect(()=>{
    updataDevice()
  },[updataDevice])

  useEffect(()=>{
    message(error,"error")
    return ()=>{
      clearError();
    }
  },[error,message, clearError])

  return devices.map((item,index)=>{
    return(
      <div className="deviceItem" key={index} onClick={()=>result(item)}>
        <p>{item.DeviceName||item.ScriptName}</p>
      </div>
    )
  })
}
