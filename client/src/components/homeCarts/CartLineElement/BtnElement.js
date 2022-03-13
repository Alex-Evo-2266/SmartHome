import React,{useState,useContext,useEffect} from 'react'
import {BaseElement} from './BaseElement'
import {useHttp} from '../../../hooks/http.hook'
import {useMessage} from '../../../hooks/message.hook'
import {AuthContext} from '../../../context/AuthContext.js'


export const BtnElement = ({children, data, onClick, index, deleteBtn, editBtn, className}) =>{
  const auth = useContext(AuthContext)
  const [value, setValue]=useState(false)
  const [switchMode, setSwitchMode] = useState(false)
  const {message} = useMessage();
  const {request, error, clearError} = useHttp();

  useEffect(()=>{
    message(error,"error")
    return ()=>{
      clearError();
    }
  },[error,message, clearError])

  const outValue = async(v)=>{
    await request(`/api/${data.data.typeItem}/value/set`, 'POST', {systemName: data.data.deviceName,type:data.data.typeAction,status:v},{Authorization: `Bearer ${auth.token}`})
  }

  useEffect(()=>{
    if(data?.field?.type==="binary"){
      setSwitchMode(true)
    }
  },[data.field])

  useEffect(()=>{
    if(typeof(onClick)==="function"||data.disabled||!data.entity||data.entity.status==="offline")return
    if(data.field.type==="binary"&&data?.fieldvalue){
      if(data.fieldvalue==="0")
        setValue(false)
      if(data.fieldvalue==="1")
        setValue(true)
      if(data.entity?.typeConnect==="mqtt"&&(!/\D/.test(data.fieldvalue)&&!/\D/.test(data.field.low)&&!/\D/.test(data.field.high))){
        let poz = Number(data.fieldvalue)
        let min = Number(data.field.low)
        let max = Number(data.field.high)
        if(poz>min&&poz<=max)
          setValue(true)
        else
          setValue(false)
      }
    }
    if(data.field.type==="number"&&data?.fieldvalue){
      if(!data.data.action)data.data.action="0"
      if(data.data.action===data.fieldvalue)
        setValue(true)
      else
        setValue(false)
    }
  },[onClick,data])

const changeHandler = (event)=>{
  let oldvel = value
  setValue((prev)=>!prev)
  if(!switchMode){
    setTimeout(()=>setValue(false),250)
  }
  if(typeof(onClick)==="function"){
    onClick(event, !oldvel,setValue)
  }

  if(!data?.entity)
    return
  // if(data.typeAction==="variable")
  //     return outValue(device.DeviceId,data.action)
  if(data.data.typeAction==="modeTarget")
      return outValue("target")
  if(data.field.type==="binary")
      return outValue((oldvel)?0:1)
  if(data.field.type==="number")
      return outValue(data.data.action)
  if(data.field.type==="text")
      return outValue(data.data.action)
  return outValue(data.data.action)
}
  if(!switchMode){
    return(
      <BaseElement onClick={changeHandler} deleteBtn = {(data.editmode)?deleteBtn:null} editBtn={(data.editmode)?editBtn:null} data={data.data} index={index}>
        <div className="icon icon-btn">
          <div className="circle">
            <i className={data.field?.icon||"fas fa-circle-notch"}></i>
          </div>
        </div>
        <p className="name">{data.title}</p>
        <p className="state">{data.data.action}</p>
      </BaseElement>
    )
  }

  return(
    <BaseElement deleteBtn = {(data.editmode)?deleteBtn:null} editBtn={(data.editmode)?editBtn:null} data={data.data} index={index}>
    <div className="icon">
      <div className="circle">
        <i className={data.field?.icon||"fas fa-circle-notch"}></i>
      </div>
    </div>
      <p className="name">{data.title}</p>
      <div className="control">
        <div className="right-control">
          <div className="custom1-checkbox">
            <div className={`custom1-inner ${(value)?"active":""}`} onClick={(data.disabled)?()=>{}:changeHandler} disabled={data.disabled} >
              <div className="custom1-toggle"></div>
            </div>
          </div>
        </div>
      </div>
    </BaseElement>
  )
}
