import React, {useContext,useState,useEffect} from 'react'
import {DeviceStatusContext} from '../../../../context/DeviceStatusContext'
import {AuthContext} from '../../../../context/AuthContext.js'
import {InputNumber} from '../../../moduls/inputNumber'

export const AddButton = ({add})=>{
  const {devices} = useContext(DeviceStatusContext)
  const [device, setDevice] = useState({});
  const [deviceConfig, setDeviceConfig] = useState({})
  const auth = useContext(AuthContext)
  const [buttonForm, setButtonForm] = useState({
    id:null,
    name:"",
    type:"button",
    typeAction:"",
    order:0,
    deviceId:null,
    action:""
  })

  useEffect(()=>{
    if(device){
      setButtonForm({...buttonForm,name:device.DeviceName,deviceId:device.DeviceId})
    }
  },[device])

  useEffect(()=>{
    if(!device||!device.DeviceConfig)return
    console.log(device.DeviceControl,buttonForm.typeAction);
    let conf = device.DeviceControl[buttonForm.typeAction]
    if(buttonForm.typeAction==="mode"){
      setDeviceConfig({min:0,max:conf-1})
      return
    }
    setDeviceConfig(conf)
  },[device,buttonForm.typeAction])

  const outaction = ()=>{
    add(buttonForm)
  }

  const out = (type)=>{
    setButtonForm({...buttonForm,typeAction:type})
    add({...buttonForm,typeAction:type})
  }

  return (
    <ul>
    {
      (!device||!device.DeviceId)?
        devices.map((item,index)=>{
          return(
            <li key={index} onClick={()=>setDevice(item)}><span>{index+1}</span>{item.DeviceName}</li>
          )
        }):
        (!buttonForm.typeAction)?
        <>
          {
            (device.DeviceControl&&device.DeviceControl.power)?
            <li onClick={()=>out("power")}>power</li>:
            null
          }
          {
            (device.DeviceControl&&device.DeviceControl.dimmer)?
            <li onClick={()=>setButtonForm({...buttonForm,typeAction:"dimmer"})}>dimmer</li>:
            null
          }
          {
            (device.DeviceControl&&device.DeviceControl.temp)?
            <li onClick={()=>setButtonForm({...buttonForm,typeAction:"temp"})}>temp</li>:
            null
          }
          {
            (device.DeviceControl&&device.DeviceControl.color)?
            <li onClick={()=>setButtonForm({...buttonForm,typeAction:"color"})}>collor</li>:
            null
          }
          {
            (device.DeviceControl&&device.DeviceControl.mode)?
            <>
              <li onClick={()=>setButtonForm({...buttonForm,typeAction:"mode"})}>mode</li>
              <li onClick={()=>out("modeTarget")}>target mode</li>
            </>:
            null
          }
        </>:
        (deviceConfig)?
        <li className="noAnim">
          <InputNumber min={deviceConfig.min} max={deviceConfig.max} Xten={true} result={(v)=>setButtonForm({...buttonForm,action:v})} Value={buttonForm.action}/>
          <button onClick={outaction}>Ok</button>
        </li>:null
    }
    </ul>
  )
}
