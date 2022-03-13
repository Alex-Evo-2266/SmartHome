import React,{useState,useContext,useEffect} from 'react'
import {BaseElement} from './BaseElement'
import {useHttp} from '../../../hooks/http.hook'
import {useMessage} from '../../../hooks/message.hook'
import {AuthContext} from '../../../context/AuthContext.js'


export const TextElement = ({data, onClick, index, deleteBtn, editBtn, className}) =>{
  const auth = useContext(AuthContext)
  const [value, setValue]=useState("")
  const [outvalue, setOutValue]=useState("")
  const [focus, setFocus] = useState(false)
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
    if(focus)
      return;
    if(!data.fieldvalue||data.disabled||data.entity?.status==="offline")return ;
    setValue(data.fieldvalue)
  },[focus,data])

const changeHandler = (event)=>{
  setValue(event.target.value)
  setOutValue(event.target.value)
}

const outHandler = (event)=>{
  return outValue(outvalue)
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
          <input type="text" onFocus={()=>setFocus(true)} onBlur={()=>setFocus(false)} value={value} onChange={changeHandler} disabled={data.disabled}/>
          <input type="button" onClick={outHandler} disabled={data.disabled} value="send"/>
        </div>
    </BaseElement>
  )
}
