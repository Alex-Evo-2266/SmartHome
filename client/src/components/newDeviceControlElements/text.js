import React, {useState, useEffect, useContext} from 'react'
import {useHttp} from '../../hooks/http.hook'
import {useMessage} from '../../hooks/message.hook'
import {AuthContext} from '../../context/AuthContext.js'

export const Text = ({updata,title,type,conf,value,systemName}) =>{
  const [newvalue, setValue]=useState("")
  const [focus, setFocus] = useState(false)
  const auth = useContext(AuthContext)
  const {message} = useMessage();
  const {request, error, clearError} = useHttp();

  useEffect(()=>{
    message(error,"error")
    return ()=>{
      clearError();
    }
  },[error,message, clearError])

  useEffect(()=>{
    if(focus)
      return ;
    setValue(value)
  },[value, focus])

  const outValue = ()=>{
    request('/api/devices/value/set', 'POST', {systemName: systemName,type:type,status:newvalue},{Authorization: `Bearer ${auth.token}`})
  }

  const changeHandler = event =>{
    setValue(event.target.value)
  }

  return(
    <li className="DeviceControlLi">
      <div className="DeviceControlLiName">
        <p>{title||"text"}</p>
      </div>
      <div className="DeviceControlLiContent">
        <div className="DeviceLiControl" style={{display: "flex",justifyContent: "flex-end"}}>
          <input type="text" onFocus={()=>setFocus(true)} onBlur={()=>setFocus(false)} value={newvalue} onChange={changeHandler}/>
          <input type="button" onClick={outValue} value="send"/>
        </div>
      </div>
    </li>
  )
}
