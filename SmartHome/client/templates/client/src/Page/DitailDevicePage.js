import React,{useContext, useState, useEffect, useCallback} from 'react'
import lightDevices from '../img/lamp.jpg'
import {SocketContext} from '../context/SocketContext'
import {MenuContext} from '../components/Menu/menuContext'
import {useParams} from "react-router-dom"
import lampOn from '../img/onLamp.png'
import lampOff from '../img/offLamp.png'
import {LightPage} from './ditailPages/lightPage'

export const DitailDevicePage = ()=>{
  const [device,setDevice] = useState(null)
  const [value,setValue] = useState(false)
  const {setData} = useContext(MenuContext)
  const {devices, updateDevice} = useContext(SocketContext)
  let {systemName} = useParams()

  const getConfig = useCallback((key)=>{
    if(!device) return null;
    for (var item of device.config) {
      if(item.name == key){
        return item
      }
    }
  },[device])

  const getValue = useCallback((key)=>{
    if(!device) return null;
    let config = getConfig(key)
    let val = device?.value[key]
    if(config.type === "binary"){
      if(val === config.high)
        return true
      else
        return false
    }
    else
      return val
  },[device, getConfig])

  useEffect(()=>{
    if(devices){
      let newdev = devices.filter(item => (item&&item.systemName===systemName))[0]
      setDevice(newdev)
    }
  },[devices,systemName])

  useEffect(()=>{
    let d = getValue("state")
    setValue(d)
  },[device, getValue])

  useEffect(()=>{
    setData(device?.name)
  },[setData, device])

  return(
    <div className="conteiner fon">
    {
      (device?.type === "light")?
      <LightPage device={device}/>
      :null
    }
    </div>
  )
}
