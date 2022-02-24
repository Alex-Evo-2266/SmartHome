import React,{useContext, useEffect} from 'react'
import {AuthContext} from '../../../context/AuthContext.js'
import {useHttp} from '../../../hooks/http.hook'
import {getValue} from './utils'
import {useMessage} from '../../../hooks/message.hook'

export const Btn = ({device, item})=>{
  const auth = useContext(AuthContext)
  const {request, error, clearError} = useHttp();
  const {message} = useMessage();

  useEffect(()=>{
    message(error,"error")
    return ()=>{
      clearError();
    }
  },[error,message, clearError])

  const outValue = async(systemName,name,v)=>{
    await request('/api/device/value/set', 'POST', {systemName: systemName,type:name,status:v},{Authorization: `Bearer ${auth.token}`})
  }

  const togleField = (name)=>{
    let val = device.value[name]
    outValue(device.systemName, name, (val==="1")?0:1)
  }

  return (
    <div onClick={()=>togleField(item.name)} className={`dopBlubButton ${(getValue(device,item.name))?"activ":""}`}>
      <i className={item.icon||"far fa-lightbulb"}></i>
    </div>
  )
}
