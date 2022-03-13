import React,{useState,useContext,useEffect,useRef} from 'react'
import {AuthContext} from '../../../context/AuthContext.js'
// import {RunText} from '../../runText'
import {BaseElement} from './BaseElement'
import {useHttp} from '../../../hooks/http.hook'
import {useMessage} from '../../../hooks/message.hook'

export const SliderElement = ({data, onClick, index, deleteBtn, editBtn, className}) =>{
  const auth = useContext(AuthContext)
  const [value, setValue] = useState(0)
  const delay = useRef(null)
  const {message} = useMessage();
  const {request, error, clearError} = useHttp();

  const outValue = async(v)=>{
    await request(`/api/${data.data.typeItem}/value/set`, 'POST', {systemName: data.data.deviceName,type:data.data.typeAction,status:v},{Authorization: `Bearer ${auth.token}`})
  }

  useEffect(()=>{
    message(error,"error")
    return ()=>{
      clearError();
    }
  },[error,message, clearError])

  useEffect(()=>{
    if(typeof(onClick)==="function")return
    if(!data.fieldvalue)return ;
    setValue(Number(data.fieldvalue))
  },[onClick,data])

  const changeHandler = (event)=>{
    setValue(event.target.value)
    if(delay.current){
      clearTimeout(delay.current)
    }
    delay.current = setTimeout(function () {
      outValue(event.target.value)
    }, 200);
  }

if(!data.entity){
  return null
}

return(
  <BaseElement deleteBtn = {(data.editmode)?deleteBtn:null} editBtn={(data.editmode)?editBtn:null} data={data.data} index={index}>
    <div className="icon">
      <div className="circle">
        <i className={data.field?.icon||"fas fa-circle-notch"}></i>
      </div>
    </div>
      <p className="name">{data.title}</p>
      <div className="flex">
        <input
        className="control-big"
        type="range"
        min={data.field?.low||0}
        max={data.field?.high||100}
        value={value}
        onChange={changeHandler}
        onInput={changeHandler}
        disabled={data.disabled}
        />
        <div className="state">{value}</div>
      </div>
  </BaseElement>
)
}
