import React,{useState,useContext,useEffect,useCallback} from 'react'
import {SocketContext} from '../../../context/SocketContext'
import {BaseElement} from './BaseElement'
import {useHttp} from '../../../hooks/http.hook'
import {useMessage} from '../../../hooks/message.hook'
import {AuthContext} from '../../../context/AuthContext.js'


export const EnumElement = ({title,data,className,index,children,name,onClick,disabled=false,editBtn,firstValue=false,deleteBtn}) =>{
  const {devices} = useContext(SocketContext)
  const auth = useContext(AuthContext)
  const [value, setValue]=useState(firstValue)
  const [device, setDevice] = useState({})
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
    await request('/api/device/value/set', 'POST', {systemName: data.deviceName,type:data.typeAction,status:v},{Authorization: `Bearer ${auth.token}`})
  }

  const lookForDeviceById = useCallback((id)=>{
    if(!devices||!devices[0])
      return false
    let condidat = devices.filter((item)=>(item&&item.systemName===id))
    return condidat[0]
  },[devices])

  useEffect(()=>{
    if(!data||!data.deviceName||typeof(onClick)==="function")
      return
    setDevice(lookForDeviceById(data.deviceName))
  },[devices,data,onClick,lookForDeviceById])

  const itemField = useCallback(()=>{
    if(!device||!device.config)return
    for (var item of device.config) {
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
    if(!device||!device.config||!data)return
    const {typeAction} = data
    let conf = device.config.filter((item)=>item.name===typeAction)
    if(conf.length)
      setDeviceConfig(conf[0])
  },[device,data])

  useEffect(()=>{
    if(typeof(onClick)==="function"||!deviceConfig||!deviceConfig.name||!device||!device.value||disabled||device.status==="offline")return;
    setValue(device.value[deviceConfig.name])
  },[device,onClick,data,deviceConfig,disabled])

const changeHandler = (event)=>{
  setValue(event.target.value)

  if(!data||!device)
    return
  return outValue(device.systemName,event.target.value)
}

  const valuesDecod = (data)=>{
    let newstr = data.split(" ").join("")
    let arr1 = newstr.split(",")
    return arr1
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

        {
          (deviceConfig&&deviceConfig.values)?
          <select value={value} onChange={changeHandler} disabled={disabled2}>
          {
            valuesDecod(deviceConfig.values).map((item,index)=>{
              return(
                <option key={index} value={item}>{item}</option>
              )
            })
          }
          </select>
          :null
        }
    </BaseElement>
  )
}
