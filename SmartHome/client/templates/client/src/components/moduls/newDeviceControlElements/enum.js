import React, {useState,useContext,useEffect} from 'react'
import {useHttp} from '../../../hooks/http.hook'
import {useMessage} from '../../../hooks/message.hook'
import {AuthContext} from '../../../context/AuthContext.js'

export const Enum = ({updata,title,type,conf,value,idDevice}) =>{
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
    await request('/api/devices/value/set', 'POST', {id: idDevice,type:type,status:v},{Authorization: `Bearer ${auth.token}`})
  }

  const changeHandler = event =>{
    setValue(event.target.value)
    outValue(event.target.value)
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
