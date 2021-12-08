import React,{useState,useContext,useEffect,useCallback} from 'react'
import {useHttp} from '../../../hooks/http.hook'
import {useMessage} from '../../../hooks/message.hook'
import {AuthContext} from '../../../context/AuthContext.js'

export const ShowScript = ({data})=>{
  const auth = useContext(AuthContext)
  const {message} = useMessage();
  const {request, error, clearError} = useHttp();
  const [devices,setDevices]=useState([])
  const [script] = useState({
    if:data.ScriptIf,
    then:data.ScriptThen,
    else:data.ScriptElse,
    trigger:data.ScriptTrigger
  })

  useEffect(()=>{
    message(error,"error")
    return ()=>{
      clearError();
    }
  },[error,message, clearError])

  const updataDevice = useCallback(async()=>{
    const data = await request('/api/devices/all', 'GET', null,{Authorization: `Bearer ${auth.token}`})
    setDevices(data);
  },[request,auth.token])

  useEffect(()=>{
    updataDevice()
  },[updataDevice])

  const trigger = (content)=>{
    return content.map((item)=>{
      if(item.type==="device"){
        let condidat = devices.filter((item2)=>item2.systemName===item.systemName)
        if(!condidat||!condidat[0])
          return"error"
        return `${condidat[0].systemName}`
      }
      return "error"
    })
  }

  const element = (content)=>{
    if(content.type!=="device") return
    let condidat = devices.filter((item)=>item.systemName===content.systemName)
    if(!condidat||!condidat[0])
      return"error"
    return `${condidat[0].systemName} ${content.property} ${content.oper} ${content.value}`
  }

  const group = (content)=>{
    return `(${(content.ifElement.map((item)=>{
      if(item.type==="groupIfClass"){
        return `${group(item.subif)}`
      }else{
        return element(item.subif)
      }
    })).join(`) ${content.oper} (`)})`
  }

  const then = (content)=>{
    return content.map((item)=>{
      if(item.type==="device"){
        let condidat = devices.filter((item2)=>item2.systemName===item.systemName)
        if(!condidat||!condidat[0])
          return "error"
        return `${condidat[0].systemName} ${item.property} = ${value(item.value)}`
      }
      return "error"
    })
  }

  const value = (content)=>{
    if(content.type==="status"||content.type==="value"){
      return content.value
    }
    else if(content.type==="DeviseValue"){
      let condidat = devices.filter((item2)=>item2.systemName===content.value.systemName)
      if(!condidat||!condidat[0])
        return "error"
      return `${condidat[0].systemName}>${content.value.property}`
    }
  }

  return(
    <div>
      <h3>Script - {data.ScriptName}</h3>
      <div>
      {
        // JSON.stringify(script.trigger)
      }
        {
          (script.if&&script.if.ifElement)?
          <>
            <p>{`trigger ${trigger(script.trigger)}`}</p>
            <p>{`if ${group(script.if)}`}</p>
            <p>{`then ${then(script.then)}`}</p>
            <p>{`else ${then(script.else)}`}</p>
          </>
          :null
        }
      </div>
    </div>
  )
}
