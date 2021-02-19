import React, {useContext,useState,useEffect} from 'react'
import {FormContext} from '../Form/formContext'
import {RunText} from '../runText'
import {Power} from './newDeviceControlElements/power'
import {Dimmer} from './newDeviceControlElements/dimmer'
import {Mode} from './newDeviceControlElements/mode'
import {Color} from './newDeviceControlElements/color'
import {DeviceStatusContext} from '../../context/DeviceStatusContext'

export const NewDeviceElement = ({id}) =>{
  const {devices, updateDevice} = useContext(DeviceStatusContext)
  const form = useContext(FormContext)
  const [device,setDevice] = useState({})

  useEffect(()=>{
    if(devices)
      setDevice(devices.filter(item => (item&&item.DeviceId===id))[0])
  },[devices,id])

  if(!device||!device.DeviceControl){
    return null
  }

  return(
    <div className = "NewCardElement">
      <div className = "NewCardHeader">
        <div className = {`typeConnect ${device.DeviceTypeConnect||"other"}`}>
          <p>{device.DeviceTypeConnect||"other"}</p>
        </div>
        <RunText className="DeviceName" id={device.DeviceSystemName} text={device.DeviceName||"NuN"}/>
      </div>
      <div className = "NewCardBody">
        <ul>
        {
          (device.DeviceControl.power)?
          <Power updata = {updateDevice} idDevice={device.DeviceId} value={(device.DeviceValue.power==="on"||device.DeviceValue.power==="1")?1:0} type="power"/>:null
        }
        {
          (device.DeviceControl.dimmer)?
          <Dimmer updata = {updateDevice} idDevice={device.DeviceId} value={Number(device.DeviceValue.dimmer)} type="dimmer" conf={device.DeviceControl.dimmer}/>:null
        }
        {
          (device.DeviceControl.temp)?
          <Dimmer updata = {updateDevice} idDevice={device.DeviceId} value={Number(device.DeviceValue.temp)} type="temp" conf={device.DeviceControl.temp}/>:null
        }
        {
          (device.DeviceControl.color)?
          <Color updata = {updateDevice} idDevice={device.DeviceId} value={Number(device.DeviceValue.color)} type="color"/>:null
        }
        {
          (device.DeviceControl.mode)?
          <Mode updata = {updateDevice} idDevice={device.DeviceId} value={Number(device.DeviceValue.mode)} type="mode" conf={device.DeviceControl.mode}/>:null
        }
        </ul>
      </div>
      <div className = "NewCardControl">
        <button className="cardControlBtn" onClick={()=>{form.show("EditDevices",updateDevice,device.DeviceId)}}>edit</button>
      </div>
    </div>
  )
}
