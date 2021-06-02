import React, {useEffect,useState} from 'react'
import {Loader} from '../../Loader'
import {DeviceMqttEdit} from './editDevicesPage/DeviceMqtt.js'
import {DeviceMiioEdit} from './editDevicesPage/DeviceMiio.js'
import {SistemVariableEdit} from './editDevicesPage/SistemVariable.js'

export const LincDevicesForm = (props)=>{
  const [device, setDevice] = useState();

  useEffect(()=>{
    setDevice(props.data)
  },[props.data])

if(!device){
  return(
    <Loader/>
  )
}
if(device.DeviceTypeConnect==="mqtt"){
  return(
    <div className = "form">
      <div className="editDevicesForm moreInput">
        <DeviceMqttEdit deviceData = {device} hide={props.hide} type="link"/>
      </div>
    </div>
  )
}
if(device.DeviceTypeConnect==="yeelight"){
  return(
    <div className = "form">
      <div className="editDevicesForm moreInput">
        <DeviceMiioEdit deviceData = {device} hide={props.hide} type="link"/>
      </div>
    </div>
  )
}
if(device.DeviceTypeConnect==="miio"){
  return(
    <div className = "form">
      <div className="editDevicesForm moreInput">
        <DeviceMiioEdit deviceData = {device} hide={props.hide} type="link"/>
      </div>
    </div>
  )
}
if(device.DeviceTypeConnect==="system"&&device.DeviceType==="variable"){
  return(
    <div className = "form">
      <div className="editDevicesForm moreInput">
        <SistemVariableEdit deviceData = {device} hide={props.hide} type="link"/>
      </div>
    </div>
  )
}
  return(
    <Loader/>
  )
}
