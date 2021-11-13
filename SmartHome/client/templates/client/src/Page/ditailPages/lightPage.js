import React,{useContext, useState, useEffect, useCallback, useRef} from 'react'
import lightDevices from '../../img/lamp.jpg'
import {SocketContext} from '../../context/SocketContext'
import {MenuContext} from '../../components/Menu/menuContext'
import {useParams} from "react-router-dom"
import {useHttp} from '../../hooks/http.hook'
import {AuthContext} from '../../context/AuthContext.js'
import {useMessage} from '../../hooks/message.hook'

export const LightPage = ({device})=>{
  const auth = useContext(AuthContext)
  const [value,setValue] = useState(false)
  const blub = useRef(null)
  const {message} = useMessage();
  const {request, error, clearError} = useHttp();
  let {id} = useParams()

  const getConfig = useCallback((key)=>{
    if(!device) return null;
    for (var item of device.DeviceConfig) {
      if(item.name == key){
        return item
      }
    }
  },[device])

  const getValue = useCallback((key)=>{
    if(!device) return null;
    let config = getConfig(key)
    let val = device?.DeviceValue[key]
    if(config.type === "binary"){
      if(val === "1")
        return true
      else
        return false
    }
    else
      return val
  },[device, getConfig])

  const getBlub = (fields)=>fields?.filter((item)=>(item?.type === "binary" && (item?.name?.toLowerCase()?.indexOf("state") != -1 || item?.name?.toLowerCase()?.indexOf("power") != -1)))

  const generalBlub = (fields)=>{
    let blubs = getBlub(fields)||[]
    let blubs2 = blubs.filter((item)=>(item?.name?.toLowerCase()?.indexOf("state") == 0 || item?.name?.toLowerCase()?.indexOf("power") == 0))
    if(blubs2.length > 0)
      return blubs2[0]
    if(blubs.length > 0)
      return blubs[0]
    return null
  }

  const dopBlub = (fields)=>{
    let blubs = getBlub(fields)
    let blub = generalBlub(fields)
    return blubs.filter((item)=>item.name != blub.name)
  }

  const outValue = async(id,name,v)=>{
    await request('/api/devices/value/set', 'POST', {id: id,type:name,status:v},{Authorization: `Bearer ${auth.token}`})
  }

  const togleField = (name)=>{
    let val = device.DeviceValue[name]
    outValue(device.DeviceId, name, (val==="1")?0:1)
  }

  // const getValue = (name)=>device.DeviceValue[name]

  useEffect(()=>{
    let d = getValue("state")
    setValue(d)
  },[device, getValue])

  useEffect(()=>{
   console.log(value);
  },[value])

  useEffect(()=>{
    blub.current?.style.setProperty('--blub-on',"#fff")
  },[])

  useEffect(()=>{
    message(error,"error")
    return ()=>{
      clearError();
    }
  },[error,message, clearError])

  return(
    <div className="ditailContainer">
      <div className="leftControl"></div>
      <div className="centerControl">
        <p className="lightName">{device?.DeviceName}</p>
      {
        [generalBlub(device.DeviceConfig)]?.map((item,index)=>{
          return(
          <div key={index}>
            <div className="blubContainer">
              <div onClick={()=>togleField(item.name)} ref={blub} className={`bulb ${(value)?"on":"off"}`}>
                <span></span>
                <span></span>
              </div>
            </div>
            <p className="nameGeneralBlub">{item.name}</p>
          </div>
          )
        })
      }
        <div className="dopBlubContainer">
        <div className="dividers"></div>
        {
          dopBlub(device.DeviceConfig).map((item, index)=>{
            return (
              <div onClick={()=>togleField(item.name)} key={index} className={`dopBlubButton ${(getValue(item.name))?"activ":""}`}>
                <i className={item.icon}></i>
              </div>
            )
          })
        }
        </div>
      </div>
      <div className="rightControl"></div>
    </div>
  )
}
