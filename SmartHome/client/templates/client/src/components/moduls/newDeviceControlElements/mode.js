import React, {useState,useContext,useEffect} from 'react'
import {useHttp} from '../../../hooks/http.hook'
import {useMessage} from '../../../hooks/message.hook'
import {AuthContext} from '../../../context/AuthContext.js'

export const Mode = ({updata,title,type,conf,value,idDevice}) =>{
  const [newvalue, setValue]=useState(0)
  const auth = useContext(AuthContext)
  const {message} = useMessage();
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

  const outValue = async(v)=>{
    await request('/api/devices/value/set', 'POST', {id: idDevice,type:"mode",status:v},{Authorization: `Bearer ${auth.token}`})
  }

  const clickHandler = event =>{
    if(newvalue>=conf-1){
      setValue(0)
      outValue(0)
    }
    else{
      outValue(newvalue+1)
      setValue(newvalue+1)
    }
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
        <input type="button" value="mode" onClick={clickHandler}/>
      </div>
      </div>
    </li>
  )
}
