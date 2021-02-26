import React,{useState,useContext,useEffect,useCallback} from 'react'
import {DeviceStatusContext} from '../../../context/DeviceStatusContext'
import {CartEditContext} from '../EditCarts/CartEditContext'
import {useHttp} from '../../../hooks/http.hook'
import {useMessage} from '../../../hooks/message.hook'
import {AuthContext} from '../../../context/AuthContext.js'


export const BtnElement = ({data,className,index,children,name,onClick,disabled=false,editBtn,firstValue=false,switchMode=true,deleteBtn}) =>{
  const {devices} = useContext(DeviceStatusContext)
  const auth = useContext(AuthContext)
  const [value, setValue]=useState(firstValue)
  const [device, setDevice] = useState({})
  const [deviceConfig, setDeviceConfig] = useState({})
  const [disabled2, setDisabled] = useState(disabled)
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
    let condidat = devices.filter((item)=>item.DeviceId===id)
    return condidat[0]
  },[devices])

  useEffect(()=>{
    if(!data||!data.deviceId||typeof(onClick)==="function")
      return
    setDevice(lookForDeviceById(data.deviceId))
  },[devices,data,onClick,lookForDeviceById])

  useEffect(()=>{
    if(!disabled&&device.status){
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
    if(!device||!device.DeviceConfig)return
    let conf = device.DeviceConfig.filter((item)=>item.type===data.typeAction)
    if(conf.length)
      setDeviceConfig(conf[0])
  },[device])

  useEffect(()=>{
    if(typeof(onClick)==="function")return
    if(device&&data&&data.typeAction==="power"&&device.DeviceValue&&device.DeviceValue.power){
      if(!/\D/.test(device.DeviceValue.power)&&!/\D/.test(deviceConfig.low)&&!/\D/.test(deviceConfig.high)){
        let poz = Number(device.DeviceValue.power)
        let min = Number(deviceConfig.low)
        let max = Number(deviceConfig.high)
        if(poz>min&&poz<=max)
          setValue(true)
        else
          setValue(false)
      }
      if(device.DeviceValue.power===deviceConfig.low||(device.DeviceTypeConnect!=="mqtt"&&device.DeviceValue.power==="off"))
        setValue(false)
      if(device.DeviceValue.power===deviceConfig.high||(device.DeviceTypeConnect!=="mqtt"&&device.DeviceValue.power==="on"))
        setValue(true)
    }
    if(device&&data&&data.typeAction==="mode"&&device.DeviceValue&&device.DeviceValue.mode){
      if(data.action===device.DeviceValue.mode){
        setValue(true)
      }
      else {
        setValue(false)
      }
    }
  },[device,onClick,data])

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
  if(data.typeAction==="power")
      outValue(device.DeviceId,!oldvel)
  if(data.typeAction==="dimmer")
      outValue(device.DeviceId,data.action)
  if(data.typeAction==="temp")
      outValue(device.DeviceId,data.action)
  if(data.typeAction==="color")
      outValue(device.DeviceId,data.action)
  if(data.typeAction==="mode")
      outValue(device.DeviceId,data.action)
  if(data.typeAction==="modeTarget")
      outValue(device.DeviceId,"target")
  // if(data.type==="ir")
  //     socket.terminalMessage(`device ${device.DeviceSystemName} send ${data.value}`)
  // // socket.terminalMessage()
  return
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
      <div className="icon-box">
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
        {children}
      </div>

    </label>
  )
}
