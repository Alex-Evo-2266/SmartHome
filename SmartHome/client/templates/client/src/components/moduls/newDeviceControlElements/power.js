import React, {useState,useContext} from 'react'
import {useHttp} from '../../../hooks/http.hook'
import {useMessage} from '../../../hooks/message.hook'
import {AuthContext} from '../../../context/AuthContext.js'

export const Power = ({title,type,conf,value,idDevice}) =>{
  const auth = useContext(AuthContext)
  const {message} = useMessage();
  const {loading, request, error, clearError} = useHttp();
  const [newvalue, setValue]=useState(value)

  const outValue = async(v)=>{
    const data = await request('/api/devices/value/set', 'POST', {id: idDevice,type:"power",status:v},{Authorization: `Bearer ${auth.token}`})
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
  }

  return(
    <li className="DeviceControlLi">
      <div className="DeviceControlLiName">
        <p>{title}</p>
      </div>
      <div className="DeviceControlLiValue">
        <p>{(newvalue===1)?"on":"off"}</p>
      </div>
      <div className="DeviceLiControl">
        <input type="button" value={(newvalue===1)?"off":"on"}/>
      </div>
    </li>
  )
}
