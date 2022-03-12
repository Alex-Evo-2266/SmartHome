import React, {useState,useContext,useEffect} from 'react'
import {useHttp} from '../../hooks/http.hook'
import {useMessage} from '../../hooks/message.hook'
import {AuthContext} from '../../context/AuthContext.js'

const foo = (systemName, type, v)=>{}

export const Enum = ({updata,title,type,conf,value,systemName, outValue=foo}) =>{
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

  const changeHandler = event =>{
    setValue(event.target.value)
    outValue(systemName, type, event.target.value)
  }

  const valuesDecod = (data)=>{
    let newstr = data.split(" ").join("")
    let arr1 = newstr.split(",")
    return arr1
  }

  return(
    <li className="DeviceControlLi">
      <div className="DeviceControlLiName">
        <p>{title||type}</p>
      </div>
      <div className="DeviceControlLiContent">
        <div className="DeviceLiControl">
          <select value={newvalue} onChange={changeHandler}>
          {
            valuesDecod(conf).map((item,index)=>{
              return(
                <option key={index} value={item}>{item}</option>
              )
            })
          }
          </select>
        </div>
      </div>
    </li>
  )
}