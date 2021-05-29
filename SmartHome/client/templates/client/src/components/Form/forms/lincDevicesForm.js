import React, {useEffect,useState} from 'react'
import {Loader} from '../../Loader'
import {LightMqttEdit} from './editDevicesPage/lightMqtt'
import {SwitchMqttEdit} from './editDevicesPage/SwitchMqtt'
import {SensorMqttEdit} from './editDevicesPage/SensorMqtt'
import {OtherMqttEdit} from './editDevicesPage/OtherMqtt.js'
import {DeviceMiioEdit} from './editDevicesPage/DeviceMiio.js'
import {DimmerMqttEdit} from './editDevicesPage/DimmerMqtt.js'
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

if(device.DeviceTypeConnect==="mqtt"&&device.DeviceType==="light"){
  return(
    <div className = "form">
      <div className="editDevicesForm moreInput">
        <LightMqttEdit deviceData = {device} hide={props.hide} type="link"/>
      </div>
    </div>
  )
}
if(device.DeviceTypeConnect==="mqtt"&&device.DeviceType==="switch"){
  return(
    <div className = "form">
      <div className="editDevicesForm moreInput">
        <SwitchMqttEdit deviceData = {device} hide={props.hide} type="link"/>
      </div>
    </div>
  )
}
if(device.DeviceTypeConnect==="mqtt"&&device.DeviceType==="sensor"){
  return(
    <div className = "form">
      <div className="editDevicesForm moreInput">
        <SensorMqttEdit deviceData = {device} hide={props.hide} type="link"/>
      </div>
    </div>
  )
}
if(device.DeviceTypeConnect==="mqtt"&&device.DeviceType==="other"){
  return(
    <div className = "form">
      <div className="editDevicesForm moreInput">
        <OtherMqttEdit deviceData = {device} hide={props.hide} type="link"/>
      </div>
    </div>
  )
}
if(device.DeviceTypeConnect==="mqtt"&&device.DeviceType==="dimmer"){
  return(
    <div className = "form">
      <div className="editDevicesForm moreInput">
        <DimmerMqttEdit deviceData = {device} hide={props.hide} type="link"/>
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
