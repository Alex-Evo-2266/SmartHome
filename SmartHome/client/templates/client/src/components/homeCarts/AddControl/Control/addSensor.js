import React, {useContext,useState,useEffect} from 'react'
import {DeviceStatusContext} from '../../../../context/DeviceStatusContext'
import {Loader} from '../../../Loader'

// import {AuthContext} from '../../../../context/AuthContext.js'

export const AddSensor = ({add})=>{
  const {devices} = useContext(DeviceStatusContext)
  const [allDevices] = useState(devices);
  const [device, setDevice] = useState({});
  // const [deviceConfig, setDeviceConfig] = useState({})
  // const auth = useContext(AuthContext)
  const [buttonForm, setButtonForm] = useState({
    id:null,
    name:"",
    type:"sensor",
    typeAction:"",
    order:"0",
    deviceId:null,
    action:"",
    width:1,
    height:1
  })

  useEffect(()=>{
    if(device){
      setButtonForm({id:null,
        name:device.DeviceName,
        type:"sensor",
        typeAction:"",
        order:0,
        deviceId:device.DeviceId,
        action:"",
        width:1,
        height:1
      })
    }
  },[device])

  const out = (item)=>{
    setButtonForm({...buttonForm,typeAction:item.name,type:`sensor-${item.type}`})
    add({...buttonForm,typeAction:item.name,type:`sensor-${item.type}`})
  }

  if(!allDevices){
    return <Loader/>
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
        (!buttonForm.typeAction&&device.DeviceConfig)?
          device.DeviceConfig.map((item,index)=>{
            return <li key={index} onClick={()=>out(item)}>{item.name}</li>
          })
          :null
    }
    </ul>
  )
}
