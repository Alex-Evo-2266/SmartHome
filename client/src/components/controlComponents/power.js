import React, {useState,useContext,useEffect} from 'react'
import {useHttp} from '../../hooks/http.hook'
import {useMessage} from '../../hooks/message.hook'
import {AuthContext} from '../../context/AuthContext.js'

const foo = (systemName, type, v)=>{}

export const Power = ({updata,title,type,conf,value,systemName,outValue=foo}) =>{
  const auth = useContext(AuthContext)
  const {message} = useMessage();
  const {request, error, clearError} = useHttp();
  const [newvalue, setValue]=useState(value||0)

  useEffect(()=>{
    setValue(value)
  },[value])

  useEffect(()=>{
    message(error,"error")
    return ()=>{
      clearError();
    }
  },[error,message, clearError])

  const clickHandler = event =>{
    setValue(event.target.checked)
    if(event.target.checked)
      outValue(systemName, type, 1)
    else
      outValue(systemName, type, 0)
    setTimeout(function () {
      if(typeof(updata)==='function')
        updata()
    }, 500);
  }

  return(
    <li className="DeviceControlLi">
      <div className="DeviceControlLiName">
        <p>{title||type}</p>
      </div>
      <div className="DeviceControlLiContent">
        <div className="DeviceLiControl">
        <label className="switch">
          <input onChange={clickHandler} name="auteStyle" type="checkbox" checked={newvalue}></input>
          <span></span>
          <i className="indicator"></i>
        </label>
        </div>
      </div>
    </li>
  )
}
