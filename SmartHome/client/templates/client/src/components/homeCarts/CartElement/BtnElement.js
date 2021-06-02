import React,{useState,useContext,useEffect,useCallback} from 'react'
import {DeviceStatusContext} from '../../../context/DeviceStatusContext'
import {CartEditContext} from '../EditCarts/CartEditContext'
import {useHttp} from '../../../hooks/http.hook'
import {useMessage} from '../../../hooks/message.hook'
import {AuthContext} from '../../../context/AuthContext.js'


export const BtnElement = ({data,className,index,children,name,onClick,disabled=false,editBtn,firstValue=false,deleteBtn}) =>{
  const {devices} = useContext(DeviceStatusContext)
  const auth = useContext(AuthContext)
  const [value, setValue]=useState(firstValue)
  const [device, setDevice] = useState({})
  const [deviceConfig, setDeviceConfig] = useState({})
  const [disabled2, setDisabled] = useState(disabled)
  const [switchMode, setSwitchMode] = useState(false)
  const {message} = useMessage();
  const {request, error, clearError} = useHttp();
  const {target} = useContext(CartEditContext)

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
      if(item.type===data.typeAction){
        return item
      }
    }
  },[data.typeAction,device])

  useEffect(()=>{
    if(!disabled&&device&&device.status){
      let item = itemField()
      if(item&&item.typeControl==="boolean"){
        setSwitchMode(true)
      }
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
  },[device,disabled,devices,itemField])

  useEffect(()=>{
    if(!device||!device.DeviceConfig||!data)return
    const {typeAction} = data
    let conf = device.DeviceConfig.filter((item)=>item.type===typeAction)
    if(conf.length)
      setDeviceConfig(conf[0])
  },[device,data])

  useEffect(()=>{
    if(typeof(onClick)==="function"||disabled||device.status==="offline")return
    const {low,high,typeControl} = deviceConfig
    if(device&&typeControl==="boolean"&&device.DeviceValue&&device.DeviceValue[deviceConfig.type]){
      if(device.DeviceValue[deviceConfig.type]===low||(device.DeviceTypeConnect!=="mqtt"&&device.DeviceValue[deviceConfig.type]==="0"))
        setValue(false)
      if(device.DeviceValue[deviceConfig.type]===high||(device.DeviceTypeConnect!=="mqtt"&&device.DeviceValue[deviceConfig.type]==="1"))
        setValue(true)
      if(device.DeviceTypeConnect==="mqtt"&&(!/\D/.test(device.DeviceValue[deviceConfig.type])&&!/\D/.test(low)&&!/\D/.test(high))){
        let poz = Number(device.DeviceValue[deviceConfig.type])
        let min = Number(low)
        let max = Number(high)
        if(poz>min&&poz<=max)
          setValue(true)
        else
          setValue(false)
      }
    }
    if(device&&typeControl==="number"&&device.DeviceValue&&device.DeviceValue[deviceConfig.type]){
      if(!data.action)data.action="0"
      if(data.action===device.DeviceValue[deviceConfig.type]){
        setValue(true)
      }
      else {
        setValue(false)
      }
    }
  },[device,onClick,data,deviceConfig,disabled])

const changeHandler = (event)=>{
  let oldvel = value
  setValue((prev)=>!prev)
  if(!switchMode){
    setTimeout(()=>setValue(false),250)
  }
  if(typeof(onClick)==="function"){
    onClick(event, value,setValue)
  }

  if(!data||!device)
    return
  // if(data.typeAction==="variable")
  //     return outValue(device.DeviceId,data.action)
  if(data.typeAction==="modeTarget")
      return outValue(device.DeviceId,"target")
  if(deviceConfig.typeControl==="boolean")
      return outValue(device.DeviceId,(oldvel)?0:1)
  if(deviceConfig.typeControl==="range")
      return outValue(device.DeviceId,data.action)
  if(deviceConfig.typeControl==="text")
      return outValue(device.DeviceId,data.action)
  if(deviceConfig.typeControl==="number")
      return outValue(device.DeviceId,data.action)
  return outValue(device.DeviceId,data.action)
  // if(data.type==="ir")
  //     socket.terminalMessage(`device ${device.DeviceSystemName} send ${data.value}`)
  // // socket.terminalMessage()
  // return
  // setTimeout(()=>updateDevice(),500)
}

  const deletebtn = ()=>{
    if(typeof(deleteBtn)==="function"){
      deleteBtn(index)
    }
  }

  const editbtn = ()=>{
    if(typeof(editBtn)==="function"){
      target("button",{...data,index},editBtn)
    }
  }

  return(
    <label className={`BtnElement ${className} ${(disabled2)?"disabled":""}`}>
      <input type="checkbox" checked={value} name={name} onChange={changeHandler} disabled={disabled2}/>
      <div className="icon-conteiner">
        <div>
        {
          (deleteBtn)?
          <button className="deleteBtn" onClick={deletebtn}>&times;</button>:
          null
        }
        {
          (editBtn)?
          <button className="editBtn" onClick={editbtn}>
            <i className="fas fa-list i-cost"></i>
          </button>:
          null
        }
        </div>
        <div className="icon-box">
        {children}
        </div>
        <p>{device.DeviceName}</p>
      </div>

    </label>
  )
}
