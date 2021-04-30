import React, {useState,useContext,useEffect} from 'react'
import {useHttp} from '../../../hooks/http.hook'
import {useMessage} from '../../../hooks/message.hook'
import {AuthContext} from '../../../context/AuthContext.js'

export const Power = ({updata,title,type,conf,value,idDevice}) =>{
  const auth = useContext(AuthContext)
  const {message} = useMessage();
  const {request, error, clearError} = useHttp();
  const [newvalue, setValue]=useState(0)

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
    await request('/api/devices/value/set', 'POST', {id: idDevice,type:"power",status:v},{Authorization: `Bearer ${auth.token}`})
  }

  const clickHandler = event =>{
    setValue(prev=>{
      if(prev===0){
        outValue(1)
        return 1
      }
      outValue(0)
      return 0
    })
    setTimeout(function () {
      if(typeof(updata)==='function')
        updata()
    }, 500);
  }

  return(
    <li className="DeviceControlLi">
      <div className="DeviceControlLiName">
        <p>{title||"power"}</p>
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
