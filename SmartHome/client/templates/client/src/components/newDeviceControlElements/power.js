import React, {useState,useContext,useEffect} from 'react'
import {useHttp} from '../../hooks/http.hook'
import {useMessage} from '../../hooks/message.hook'
import {AuthContext} from '../../context/AuthContext.js'

export const Power = ({updata,title,type,conf,value,systemName}) =>{
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

  const outValue = async(v)=>{
    await request('/api/devices/value/set', 'POST', {systemName: systemName,type:type,status:v},{Authorization: `Bearer ${auth.token}`})
  }

  const clickHandler = event =>{
    setValue(event.target.checked)
    if(event.target.checked)
      outValue(1)
    else
      outValue(0)
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
