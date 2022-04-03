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
if(device.typeConnect==="Mqtt_MQTTDevice" || device.typeConnect==="Zigbee_ZigbeeDevice"){
  return(
    <div className = "form">
      <div className="editDevicesForm moreInput">
        <DeviceMqttEdit deviceData = {device} hide={props.hide} type="link"/>
      </div>
    </div>
  )
}
if(device.typeConnect==="yeelight"){
  return(
    <div className = "form">
      <div className="editDevicesForm moreInput">
        <DeviceMiioEdit deviceData = {device} hide={props.hide} type="link"/>
      </div>
    </div>
  )
}
if(device.typeConnect==="miio"){
  return(
    <div className = "form">
      <div className="editDevicesForm moreInput">
        <DeviceMiioEdit deviceData = {device} hide={props.hide} type="link"/>
      </div>
    </div>
  )
}
if(device.typeConnect==="system"&&device.type==="variable"){
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
