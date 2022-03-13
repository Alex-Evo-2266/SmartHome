import React, {useState, useEffect, useContext} from 'react'
import {useHttp} from '../../hooks/http.hook'
import {useMessage} from '../../hooks/message.hook'
import {AuthContext} from '../../context/AuthContext.js'

const foo = (systemName, type, v)=>{}

export const Text = ({updata,title,type,conf,value,systemName,outValue=foo}) =>{
  const [newvalue, setValue]=useState(value)
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

  // useEffect(()=>{
  //   if(focus)
  //     return ;
  //   setValue(value)
  // },[value, focus])

  const changeHandler = event =>{
    setValue(event.target.value)
  }

  const out = ()=>{
    outValue(systemName, type, newvalue)
    setFocus(false)
  }

  return(
    <li className="DeviceControlLi">
      <div className="DeviceControlLiName">
        <p>{title||"text"}</p>
      </div>
      <div className="DeviceControlLiContent">
        <div className="DeviceLiControl" style={{display: "flex",justifyContent: "flex-end"}}>
          <input type="text" onFocus={()=>setFocus(true)} value={newvalue} onChange={changeHandler}/>
          <input type="button" onClick={out} value="send"/>
        </div>
      </div>
    </li>
  )
}
