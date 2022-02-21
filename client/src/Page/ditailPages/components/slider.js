import React,{useContext, useState, useEffect, useCallback, useRef} from 'react'
import {RunText} from '../../../components/runText'
import {AuthContext} from '../../../context/AuthContext.js'
import {useHttp} from '../../../hooks/http.hook'
import {getValue} from './utils'
import {useMessage} from '../../../hooks/message.hook'

export const Slider = ({device, item})=>{
  const auth = useContext(AuthContext)
  const delay = useRef(null)
  const {request, error, clearError} = useHttp();
  const {message} = useMessage();
  const [value , setValue] = useState(getValue(device, item.name))

  useEffect(()=>{
    message(error,"error")
    return ()=>{
      clearError();
    }
  },[error,message, clearError])

  const outValue = async(systemName,name,v)=>{
    await request('/api/device/value/set', 'POST', {systemName: systemName,type:name,status:v},{Authorization: `Bearer ${auth.token}`})
  }

  const changeHandler = (event)=>{
    setValue(event.target.value)
    if(delay.current){
      clearTimeout(delay.current)
    }
    delay.current = setTimeout(function () {
      outValue(device.systemName, item.name, event.target.value)
    }, 200);
  }

  return (
    <div className="slider-box">
      <RunText className="name RunTextBaseColor" id={item.name} text={item.name}/>
      <div className="slider">
        <input
        type="range"
        min={Number(item.low||0)}
        max={Number(item.high||100)}
        value={value||0}
        onChange={changeHandler}
        onInput={changeHandler}
        />
      </div>
      <div className="value">{value||0}</div>
    </div>
  )
}
