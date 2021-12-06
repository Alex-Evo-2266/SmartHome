import React, {useContext,useEffect,useState,useCallback} from 'react'
import {Loader} from '../../Loader'
import {useHttp} from '../../../hooks/http.hook'
import {useMessage} from '../../../hooks/message.hook'
import {AuthContext} from '../../../context/AuthContext.js'
import {DeviceMiioEdit} from './editDevicesPage/DeviceMiio.js'
import {DeviceVariableEdit} from './editDevicesPage/SistemVariable.js'
import {DeviceMqttEdit} from './editDevicesPage/DeviceMqtt.js'


export const EditDevicesForm = (props)=>{
  const auth = useContext(AuthContext)
  const {message} = useMessage();
  const {loading, request, error, clearError} = useHttp();
  const [device, setDevice] = useState();

  const usedevice = useCallback(async()=>{
    const data = await request(`/api/devices/get/${props.systemName}`, 'GET', null,{Authorization: `Bearer ${auth.token}`})
    console.log(data);
    setDevice(data);
  },[request,auth.token,props.systemName])

  useEffect(()=>{
    usedevice()
  },[usedevice])

  useEffect(()=>{
    message(error,"error")
    return ()=>{
      clearError();
    }
  },[error,message, clearError])


  if(loading||!device){
    return (
      <Loader/>
    )
  }

if(device.typeConnect==="mqtt" || device.typeConnect==="zigbee"){
  return(
    <div className = "form">
      <div className="editDevicesForm moreInput">
        <DeviceMqttEdit deviceData = {device} hide={props.hide}/>
      </div>
    </div>
  )
}
if(device.typeConnect==="yeelight"){
  return(
    <div className = "form">
      <div className="editDevicesForm moreInput">
        <DeviceMiioEdit deviceData = {device} hide={props.hide}/>
      </div>
    </div>
  )
}
if(device.typeConnect==="miio"){
  return(
    <div className = "form">
      <div className="editDevicesForm moreInput">
        <DeviceMiioEdit deviceData = {device} hide={props.hide}/>
      </div>
    </div>
  )
}
if(device.typeConnect==="variable"&&device.type==="variable"){
  return(
    <div className = "form">
      <div className="editDevicesForm moreInput">
        <DeviceVariableEdit deviceData = {device} hide={props.hide}/>
      </div>
    </div>
  )
}
  return(
    <Loader/>
  )
}
