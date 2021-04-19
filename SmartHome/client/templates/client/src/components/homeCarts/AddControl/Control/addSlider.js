import React, {useContext,useState,useEffect} from 'react'
import {DeviceStatusContext} from '../../../../context/DeviceStatusContext'
// import {AuthContext} from '../../../../context/AuthContext.js'

export const AddSlider = ({add})=>{
  const {devices} = useContext(DeviceStatusContext)
  const [allDevices] = useState(devices.filter(item=>(item.DeviceType!=="sensor"&&item.DeviceType!=="variable"&&item.DeviceType!=="switch")));
  const [device, setDevice] = useState({});
  // const [deviceConfig, setDeviceConfig] = useState({})
  // const auth = useContext(AuthContext)
  const [buttonForm, setButtonForm] = useState({
    id:null,
    name:"",
    type:"slider",
    typeAction:"",
    order:0,
    deviceId:null,
    action:"",
    width:2
  })

  useEffect(()=>{
    if(device){
      setButtonForm({id:null,
        name:device.DeviceName,
        type:"slider",
        typeAction:"",
        order:0,
        deviceId:device.DeviceId,
        action:"",
        width:2
      })
    }
  },[device])

  // useEffect(()=>{
  //   if(!device||!device.DeviceConfig)return
  //   console.log(device.DeviceControl,buttonForm.typeAction);
  //   let conf = device.DeviceControl[buttonForm.typeAction]
  //   if(buttonForm.typeAction==="mode"){
  //     setDeviceConfig({min:0,max:conf-1})
  //     return
  //   }
  //   setDeviceConfig(conf)
  // },[device,buttonForm.typeAction])

  // const outaction = ()=>{
  //   add(buttonForm)
  // }

  const out = (type)=>{
    setButtonForm({...buttonForm,typeAction:type})
    add({...buttonForm,typeAction:type})
  }

  return (
    <ul>
    {
      (!device||!device.DeviceId)?
        allDevices.map((item,index)=>{
          return(
            <li key={index} onClick={()=>setDevice(item)}><span>{index+1}</span>{item.DeviceName}</li>
          )
        }):
        (!buttonForm.typeAction)?
        <>
          {
            (device.DeviceControl&&device.DeviceControl.dimmer)?
            <li onClick={()=>out("dimmer")}>dimmer</li>:
            null
          }
          {
            (device.DeviceControl&&device.DeviceControl.temp)?
            <li onClick={()=>out("temp")}>temp</li>:
            null
          }
          {
            (device.DeviceControl&&device.DeviceControl.color)?
            <li onClick={()=>out("color")}>collor</li>:
            null
          }
        </>:null
    }
    </ul>
  )
}
