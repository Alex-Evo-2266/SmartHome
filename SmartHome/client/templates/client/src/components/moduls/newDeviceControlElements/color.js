import React, {useState,useEffect,useContext} from 'react'
import {useHttp} from '../../../hooks/http.hook'
import {useMessage} from '../../../hooks/message.hook'
import {AuthContext} from '../../../context/AuthContext.js'

export const Color = ({updata,title,type,conf,value}) =>{
  const [newvalue, setValue]=useState(0)
  const auth = useContext(AuthContext)
  const {message} = useMessage();
  const {loading, request, error, clearError} = useHttp();

  useEffect(()=>{
    setValue(value)
  },[value])

  const changeHandler = event =>{
    setValue(event.target.value)
    setTimeout(function () {
      updata()
    }, 500);
  }

  return(
    <li className="DeviceControlLi">
      <div className="DeviceControlLiName">
        <p>{title}</p>
      </div>
      <div className="DeviceControlLiContent">
      <div className="DeviceControlLiValue">
        <p>{newvalue}</p>
      </div>
      <div className="DeviceLiControl">
      {
        (type==="power")?
        <input type="button" value={(newvalue===1)?"off":"no"}/>:
        (type==="dimmer")?
        <input type="range" min={conf.min} max={conf.max} onChange={changeHandler}/>:
        (type==="temp")?
        <input type="range" min={conf.min} max={conf.max} onChange={changeHandler}/>:
        (type==="color")?
        <p>404</p>:
        (type==="mode")?
        <input type="button"/>:
        null
      }

      </div>
      </div>
    </li>
  )
}
