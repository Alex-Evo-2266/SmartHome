import React,{useState,useContext,useEffect,useRef,useCallback} from 'react'
import {SocketContext} from '../../../context/SocketContext'
import {AuthContext} from '../../../context/AuthContext.js'
// import {RunText} from '../../runText'
import {BaseElement} from './BaseElement'
import {useHttp} from '../../../hooks/http.hook'
import {useMessage} from '../../../hooks/message.hook'

export const SliderElement = ({title,index,data,min=0,max=100,disabled=false,firstValue=0,deleteBtn,editBtn,onClick}) =>{
  const {devices} = useContext(SocketContext)
  const auth = useContext(AuthContext)
  const [value , setValue] = useState(firstValue)
  const delay = useRef(null)
  const {message} = useMessage();
  const {request, error, clearError} = useHttp();
  const [disabled2, setDisabled] = useState(disabled)
  const [device, setDevice] = useState({})
  const [minstate, setMin] = useState(0)
  const [maxstate, setMax] = useState(100)

  const lookForDeviceById = useCallback((id)=>{
    if(!devices||!devices[0]||!data)
      return false
    let condidat = devices.filter((item)=>item&&item.systemName===id)
    if(!condidat[0]) return null
    let conf
    for (var item of condidat[0].config) {
      if(item.name===data.typeAction){
        conf = item
      }
    }
    setMin(conf.low)
    setMax(conf.high)
    return condidat[0]
  },[devices,data])

  const outValue = async(v)=>{
    await request('/api/devices/value/set', 'POST', {systemName: data.deviceName,type:data.typeAction,status:v},{Authorization: `Bearer ${auth.token}`})
  }

  const itemField = useCallback(()=>{
    if(!device||!device.config||!data)return
    for (var item of device.config) {
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
    if(!data||!data.deviceName||typeof(onClick)==="function"){
      setMin(min)
      setMax(max)
      return
    }
    setDevice(lookForDeviceById(data.deviceName))
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
    if(!device||!device.value)return
    setValue(Number(device.value[data.typeAction]))
  },[device,onClick,data])

  const changeHandler = (event)=>{
    setValue(event.target.value)
    if(delay.current){
      clearTimeout(delay.current)
    }
    delay.current = setTimeout(function () {
      outValue(event.target.value)
    }, 200);
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
      <p className="name">{title}</p>
      <div className="flex">
        <input
        className="control-big"
        type="range"
        min={minstate}
        max={maxstate}
        value={value}
        onChange={changeHandler}
        onInput={changeHandler}
        disabled={disabled2}
        />
        <div className="state">{value}</div>
      </div>
  </BaseElement>
)
}
