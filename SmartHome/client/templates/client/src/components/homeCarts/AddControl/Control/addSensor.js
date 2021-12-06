import React, {useContext,useState,useEffect} from 'react'
import {SocketContext} from '../../../../context/SocketContext'
import {Loader} from '../../../Loader'

// import {AuthContext} from '../../../../context/AuthContext.js'

export const AddSensor = ({add})=>{
  const {devices} = useContext(SocketContext)
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
    deviceName:null,
    action:"",
    width:1,
    height:1
  })

  useEffect(()=>{
    if(device){
      setButtonForm({id:null,
        name:device.name,
        type:"sensor",
        typeAction:"",
        order:0,
        deviceName:device.systemName,
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
      (!device||!device.systemName)?
        allDevices.map((item,index)=>{
          return(
            <li key={index} onClick={()=>setDevice(item)}><span>{index+1}</span>{item.DeviceName}</li>
          )
        }):
        (!buttonForm.typeAction&&device.config)?
          device.config.map((item,index)=>{
            return <li key={index} onClick={()=>out(item)}>{item.name}</li>
          })
          :null
    }
    </ul>
  )
}
