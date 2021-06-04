import React,{useState,useContext,useEffect,useCallback} from 'react'
import {DeviceStatusContext} from '../../../context/DeviceStatusContext'
import {AuthContext} from '../../../context/AuthContext.js'
// import {RunText} from '../../runText'
import {BaseElement} from './BaseElement'
import {useHttp} from '../../../hooks/http.hook'
import {useMessage} from '../../../hooks/message.hook'

export const SliderElement = ({index,data,min=0,max=100,disabled=false,firstValue=0,deleteBtn,editBtn,onClick}) =>{
  const {devices} = useContext(DeviceStatusContext)
  const auth = useContext(AuthContext)
  const [value , setValue] = useState(firstValue)
  const {message} = useMessage();
  const {request, error, clearError} = useHttp();
  const [disabled2, setDisabled] = useState(disabled)
  const [device, setDevice] = useState({})
  const [minstate, setMin] = useState(0)
  const [maxstate, setMax] = useState(100)

  const lookForDeviceById = useCallback((id)=>{
    if(!devices||!devices[0]||!data)
      return false
    let condidat = devices.filter((item)=>item&&item.DeviceId===id)
    if(!condidat[0]) return null
    setMin(condidat[0].DeviceControl[data.typeAction].min)
    setMax(condidat[0].DeviceControl[data.typeAction].max)
    return condidat[0]
  },[devices,data])

  const outValue = async(v)=>{
    await request('/api/devices/value/set', 'POST', {id: data.deviceId,type:data.typeAction,status:v},{Authorization: `Bearer ${auth.token}`})
  }

  const itemField = useCallback(()=>{
    if(!device||!device.DeviceConfig||!data)return
    for (var item of device.DeviceConfig) {
      if(item.type===data.typeAction){
        return item
      }
    }
  },[data,device])

  useEffect(()=>{
    message(error,"error")
    return ()=>{
      clearError();
    }
  },[error,message, clearError])

  useEffect(()=>{
    if(!data||!data.deviceId||typeof(onClick)==="function"){
      setMin(min)
      setMax(max)
      return
    }
    setDevice(lookForDeviceById(data.deviceId))
  },[devices,data,onClick,lookForDeviceById,min,max])

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
    if(typeof(onClick)==="function")return
    if(!device||!device.DeviceValue)return
    setValue(Number(device.DeviceValue[data.typeAction]))
  },[device,onClick,data])

  const changeHandler = (event)=>{
    setValue(event.target.value);
  }

  const mouseUp = (event)=>{
    if(typeof(onClick)==="function"){
      onClick(event, value,setValue)
    }
    outValue(value)

    // if(!data||!device)
    //   return
    // // if(data.type==="dimmer")
    // //     socket.terminalMessage(`device ${device.DeviceSystemName} dimmer ${value}`)
    // // if(data.type==="color")
    // //     socket.terminalMessage(`device ${device.DeviceSystemName} color ${value}`)
    // // // socket.terminalMessage()
    // return
    // // setTimeout(()=>updateDevice(),500)
  }

if(!device){
  return null
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
      <p className="name">{data.name}</p>
      <div className="flex">
        <input
        className="control-big"
        type="range"
        min={minstate}
        max={maxstate}
        value={value}
        onChange={changeHandler}
        onMouseUp={mouseUp}
        disabled={disabled2}
        />
        <div className="state">{value}</div>
      </div>
  </BaseElement>
)
}
