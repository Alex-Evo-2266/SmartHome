import React, {useState,useContext,useEffect} from 'react'
import {useHttp} from '../../hooks/http.hook'
import {useMessage} from '../../hooks/message.hook'
import {AuthContext} from '../../context/AuthContext.js'

export const Mode = ({updata,title,type,conf,value,systemName}) =>{
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
    await request('/api/device/value/set', 'POST', {systemName: systemName,type:type,status:v},{Authorization: `Bearer ${auth.token}`})
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
      if(typeof(updata)==='function')
        updata()
    }, 500);
  }
  if(conf===2){
    return(
      <li className="DeviceControlLi">
        <div className="DeviceControlLiName">
          <p>{title||type}</p>
        </div>
        <div className="DeviceControlLiContent">
          <div className="DeviceLiControl">
            <div className="custom1-checkbox">
              <div className={`custom1-inner ${(newvalue===1)?"active":""}`} onClick={clickHandler} >
                <div className="custom1-toggle"></div>
              </div>
            </div>
          </div>
        </div>
      </li>
    )
  }

  return(
    <li className="DeviceControlLi">
      <div className="DeviceControlLiName">
        <p>{title||"mode"}</p>
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
