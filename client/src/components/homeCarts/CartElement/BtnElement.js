import React,{useState,useContext,useEffect,useCallback} from 'react'
import {SocketContext} from '../../../context/SocketContext'
import {CartEditContext} from '../EditCarts/CartEditContext'
import {useHttp} from '../../../hooks/http.hook'
import {useMessage} from '../../../hooks/message.hook'
import {AuthContext} from '../../../context/AuthContext.js'


export const BtnElement = ({children, data, onClick, index, deleteBtn, editBtn, className, name}) =>{
  const auth = useContext(AuthContext)
  const [value, setValue]=useState(false)
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
    await request(`/api/${data.data.typeItem}/value/set`, 'POST', {systemName: id,type:data.data.typeAction,status:v},{Authorization: `Bearer ${auth.token}`})
  }

  useEffect(()=>{
    if(data.field?.type==="binary")
      setSwitchMode(true)
  },[])

  useEffect(()=>{
    if(typeof(onClick)==="function"||data.disabled||data.entity?.status==="offline")return
    const {low, high, type, name} = data.field
    if(data.entity && data.field.type==="binary" && data.fieldvalue){
      if(data.fieldvalue===data.field.low)
          setValue(false)
      if(data.fieldvalue===data.field.high)
        setValue(true)
      if(data.entity.typeConnect==="mqtt"&&(!/\D/.test(data.fieldvalue)&&!/\D/.test(data.field.low)&&!/\D/.test(data.field.high))){
        let poz = Number(data.fieldvalue)
        let min = Number(data.field.low)
        let max = Number(data.field.high)
        if(poz>min&&poz<=max)
          setValue(true)
        else
          setValue(false)
      }
    }
    if(data.entity && data.field.type==="number" && data.fieldvalue){
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
    onClick(event, value,setValue)
  }

  if(!data.data || !data.entity)
    return
  // if(data.typeAction==="variable")
  //     return outValue(device.DeviceId,data.action)
  if(data.typeAction==="modeTarget")
      return outValue(data.entity.systemName,"target")
  if(data.field.type==="binary")
      return outValue(data.entity.systemName,(oldvel)?0:1)
  if(data.field.type==="number")
      return outValue(data.entity.systemName,data.data.action)
  if(data.field.type==="text")
      return outValue(data.entity.systemName,data.data.action)
  return outValue(data.entity.systemName,data.data.action)
}

  const deletebtn = ()=>{
    if(typeof(deleteBtn)==="function"){
      deleteBtn(index)
    }
  }

  const editbtn = ()=>{
    if(typeof(editBtn)==="function"){
      target("button",{...data.data,index},editBtn)
    }
  }



  return(
    <label className={`BtnElement ${className} ${(data.disabled)?"disabled":""}`}>
      <input type="checkbox" checked={value} name={name} onChange={changeHandler} disabled={data.disabled}/>
      <div className="icon-conteiner">
      {
        (data.editmode)?
        <div className="delete-box">
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
        :null
      }
        <div className="icon-box">
        {
          (children)?
          children:
          <div className="icon">
            <div className="circle">
              <i className={data?.field?.icon||"fas fa-circle-notch"}></i>
            </div>
          </div>
        }
        </div>
        <p>{data.title}</p>
      </div>

    </label>
  )
}
