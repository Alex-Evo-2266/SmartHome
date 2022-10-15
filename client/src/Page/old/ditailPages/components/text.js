import React, {useState, useEffect, useContext} from 'react'
import {useHttp} from '../../../hooks/http.hook'
import {useMessage} from '../../../hooks/message.hook'
import {AuthContext} from '../../../context/AuthContext.js'
import {getValue} from './utils'

export const Text = ({device, item}) =>{
  const [newvalue, setValue]=useState(getValue(device, item.name))
  const auth = useContext(AuthContext)
  const {message} = useMessage();
  const {request, error, clearError} = useHttp();

  useEffect(()=>{
    message(error,"error")
    return ()=>{
      clearError();
    }
  },[error,message, clearError])

  const outValue = ()=>{
    request('/api/device/value/set', 'POST', {systemName: device.systemName,type:item.name,status:newvalue},{Authorization: `Bearer ${auth.token}`})
  }

  const changeHandler = event =>{
    setValue(event.target.value)
  }

  return(
    <div className="text-field">
      <div className="textfield-name">
        <p>{item.name||"text"}</p>
      </div>
      <div className="textfield">
        <input type="text" value={newvalue} onChange={changeHandler}/>
        <input type="button" onClick={outValue} value="send"/>
      </div>
    </div>
  )
}
