import React,{useState,useContext,useEffect,useCallback} from 'react'
import {SocketContext} from '../../../context/SocketContext'
import {BaseElement} from './BaseElement'
import {useHttp} from '../../../hooks/http.hook'
import {useMessage} from '../../../hooks/message.hook'
import {AuthContext} from '../../../context/AuthContext.js'


export const TextElement = ({title,data,className,index,children,name,onClick,disabled=false,editBtn,firstValue=false,deleteBtn}) =>{
  const {devices} = useContext(SocketContext)
  const auth = useContext(AuthContext)
  const [value, setValue]=useState(firstValue)
  const [outvalue, setOutValue]=useState("")
  const [device, setDevice] = useState({})
  const [focus, setFocus] = useState(false)
  const [deviceConfig, setDeviceConfig] = useState({})
  const [disabled2, setDisabled] = useState(disabled)
  const {message} = useMessage();
  const {request, error, clearError} = useHttp();

  useEffect(()=>{
    message(error,"error")
    return ()=>{
      clearError();
    }
  },[error,message, clearError])

  const outValue = async(id,v)=>{
    await request('/api/devices/value/set', 'POST', {id: data.deviceId,type:data.typeAction,status:v},{Authorization: `Bearer ${auth.token}`})
  }

  const lookForDeviceById = useCallback((id)=>{
    if(!devices||!devices[0])
      return false
    let condidat = devices.filter((item)=>(item&&item.DeviceId===id))
    return condidat[0]
  },[devices])

  useEffect(()=>{
    if(!data||!data.deviceId||typeof(onClick)==="function")
      return
    setDevice(lookForDeviceById(data.deviceId))
  },[devices,data,onClick,lookForDeviceById])

  const itemField = useCallback(()=>{
    if(!device||!device.DeviceConfig)return
    for (var item of device.DeviceConfig) {
      if(item.name===data.typeAction){
        return item
      }
    }
  },[data.typeAction,device])

  useEffect(()=>{
    if(!disabled&&device&&device.status){
      if(device.status==="online"){
        setDisabled(false)
      }else{
        setDisabled(true)
      }
      return
    }
    if(!disabled&&!devices.length) {
      setDisabled(true)
    }else if(!disabled&&devices.length) {
      setDisabled(false)
    }
  },[device,disabled,devices])

  useEffect(()=>{
    if(!device||!device.DeviceConfig||!data)return
    const {typeAction} = data
    let conf = device.DeviceConfig.filter((item)=>item.name===typeAction)
    if(conf.length)
      setDeviceConfig(conf[0])
  },[device,data])

  useEffect(()=>{
    if(focus)
      return;
    if(typeof(onClick)==="function"||!deviceConfig||!deviceConfig.name||!device||!device.DeviceValue||disabled||device.status==="offline")return;
    setValue(device.DeviceValue[deviceConfig.name])
  },[device,onClick,data,deviceConfig,disabled,focus])

const changeHandler = (event)=>{
  setValue(event.target.value)
  setOutValue(event.target.value)
}

const outHandler = (event)=>{
  if(!data||!device)
    return
  return outValue(device.DeviceId,outvalue)
}

  return(
    <BaseElement editBtn={editBtn} deleteBtn={deleteBtn} data={data} index={index}>
      <div className="icon">
        <div className="circle">
        {
          (itemField()&&itemField().icon)?
          <i className={itemField().icon}></i>:
          <i className="fas fa-circle-notch"></i>
        }
        </div>
      </div>
        <p className="name">{title}</p>
        <div className="control">
          <input type="text" onFocus={()=>setFocus(true)} onBlur={()=>setFocus(false)} value={value} onChange={changeHandler} disabled={disabled2}/>
          <input type="button" onClick={outHandler} disabled={disabled2} value="send"/>
        </div>
    </BaseElement>
  )
}
