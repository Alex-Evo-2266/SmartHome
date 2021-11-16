import React, {useEffect,useState} from 'react'
import {Loader} from '../../Loader'
import {DeviceMqttEdit} from './editDevicesPage/DeviceMqtt.js'
import {DeviceMiioEdit} from './editDevicesPage/DeviceMiio.js'
import {DeviceVariableEdit} from './editDevicesPage/SistemVariable.js'

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
if(device.DeviceTypeConnect==="mqtt" || device.DeviceTypeConnect==="zigbee"){
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
        <DeviceVariableEdit deviceData = {device} hide={props.hide} type="link"/>
      </div>
    </div>
  )
}
  return(
    <Loader/>
  )
}
