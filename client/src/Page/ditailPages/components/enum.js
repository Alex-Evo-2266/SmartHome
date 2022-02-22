import React, {useState,useContext,useEffect} from 'react'
import {useHttp} from '../../../hooks/http.hook'
import {useMessage} from '../../../hooks/message.hook'
import {AuthContext} from '../../../context/AuthContext.js'
import {getValue} from './utils'

export const Enum = ({device, item}) =>{
  const auth = useContext(AuthContext)
  const {message} = useMessage();
  const {request, error, clearError} = useHttp();
  const [newvalue, setValue]=useState(getValue(device, item.name))

  useEffect(()=>{
    message(error,"error")
    return ()=>{
      clearError();
    }
  },[error,message, clearError])

  const outValue = async(v)=>{
    await request('/api/device/value/set', 'POST', {systemName: device.systemName,type:item.name,status:v},{Authorization: `Bearer ${auth.token}`})
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
        <p>{item.title||"enum"}</p>
      </div>
      <div className="DeviceControlLiContent">
        <div className="DeviceLiControl">
          <select value={newvalue} onChange={changeHandler}>
          {
            valuesDecod(item.values).map((item2,index)=>{
              return(
                <option key={index} value={item2}>{item2}</option>
              )
            })
          }
          </select>
        </div>
      </div>
    </li>
  )
}
