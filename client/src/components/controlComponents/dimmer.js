import React, {useState,useEffect,useContext, useRef} from 'react'
import {useHttp} from '../../hooks/http.hook'
import {useMessage} from '../../hooks/message.hook'
import {AuthContext} from '../../context/AuthContext.js'

const foo = (systemName, type, v)=>{}

export const Dimmer = ({updata,title,type,conf,value,systemName,outValue=foo}) =>{
  const [newvalue, setValue]=useState(0)
  const auth = useContext(AuthContext)
  const {message} = useMessage();
  const delay = useRef(null)
  const {request, error, clearError} = useHttp();

  useEffect(()=>{
    setValue(value)
  },[value])

  useEffect(()=>{
    message(error,"error")
    return ()=>{
      clearError();
    }
  },[error,message, clearError])

  const changeHandler = event =>{
    setValue(event.target.value)
    setTimeout(function () {
      if(typeof(updata)==='function')
        updata()
    }, 500);
    if(delay.current){
      clearTimeout(delay.current)
    }
    delay.current = setTimeout(function () {
      outValue(systemName, type, event.target.value)
    }, 200);
  }

  function isColor(text) {
    return (text.indexOf("color") !== -1)
  }

  return(
    <li className="DeviceControlLi">
      <div className="DeviceControlLiName">
        <p>{title||"level"}</p>
      </div>
      <div className="DeviceControlLiContent">
      <div className="DeviceControlLiValue">
        <p>{newvalue||"0"}</p>
      </div>
      <div className={`DeviceLiControl ${(isColor(type))?"allColor":""}`}>
        <input type="range" value={newvalue||0} min={conf.min} max={conf.max} onChange={changeHandler} onInput={changeHandler}/>
      </div>
      </div>
    </li>
  )
}
