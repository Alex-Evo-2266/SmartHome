import React,{useContext, useState, useEffect} from 'react'
import {SocketContext} from '../context/SocketContext'
import {MenuContext} from '../components/Menu/menuContext'
import {useParams} from "react-router-dom"
import {LightPage} from './ditailPages/lightPage'
import {OtherDevicePage} from './ditailPages/otherdevice'

export const DitailDevicePage = ()=>{
  const [device,setDevice] = useState(null)
  const {setData} = useContext(MenuContext)
  const {devices} = useContext(SocketContext)
  let {systemName} = useParams()

  useEffect(()=>{
    if(devices){
      let newdev = devices.filter(item => (item&&item.systemName===systemName))[0]
      setDevice(newdev)
    }
  },[devices,systemName])

  useEffect(()=>{
    setData(device?.name)
  },[setData, device])

  if(!device || device.status !== "online" || !device?.value)
    return(null)

  return(
    <div className="conteiner fon">
    {
      (device?.type === "light")?
      <LightPage device={device}/>
      :<OtherDevicePage device={device}/>
    }
    </div>
  )
}
