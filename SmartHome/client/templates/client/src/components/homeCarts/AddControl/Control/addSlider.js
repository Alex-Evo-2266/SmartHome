import React, {useContext,useState,useEffect} from 'react'
import {SocketContext} from '../../../../context/SocketContext'
import {Loader} from '../../../Loader'

// import {AuthContext} from '../../../../context/AuthContext.js'
function sortDevice(data) {
  let arr = []
  for (var item of data) {
    for (var item2 of item.DeviceConfig) {
      if(item2.type==="number"&&item2.control){
        arr.push(item)
        break
      }
    }
  }
  return arr
}

export const AddSlider = ({add})=>{
  const {devices} = useContext(SocketContext)
  const [allDevices] = useState(sortDevice(devices));
  const [device, setDevice] = useState({});
  // const [deviceConfig, setDeviceConfig] = useState({})
  // const auth = useContext(AuthContext)
  const [buttonForm, setButtonForm] = useState({
    id:null,
    name:"",
    type:"slider",
    typeAction:"",
    order:"0",
    deviceId:null,
    action:"",
    width:2,
    height:1
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
        width:2,
        height:1
      })
    }
  },[device])

  const out = (type)=>{
    setButtonForm({...buttonForm,typeAction:type})
    add({...buttonForm,typeAction:type})
  }

  function sortField(items) {
    return items.filter((item)=>item.type==="number"&&item.control)
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
          sortField(device.DeviceConfig).map((item,index)=>{
            return <li key={index} onClick={()=>out(item.name)}>{item.name}</li>
          })
          :null
    }
    </ul>
  )
}
