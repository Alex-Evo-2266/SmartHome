import React, {useContext, useEffect} from 'react'
import {AddScriptContext} from './addScriptContext'
import {DialogWindowContext} from '../dialogWindow/dialogWindowContext'
import {SocketContext} from '../../context/SocketContext'
import {useScriptDevices} from './addScript/addScriptDevices'
import {useMessage} from '../../hooks/message.hook'
import {useHttp} from '../../hooks/http.hook'
import {AuthContext} from '../../context/AuthContext.js'

export const AddScriptState = ({children}) =>{
  const dialog = useContext(DialogWindowContext)
  const {devices} = useContext(SocketContext)
  const {message} = useMessage();
  const auth = useContext(AuthContext)
  const {request, error, clearError} = useHttp();
  const {deviceBlock} = useScriptDevices()

  const addTarget = (result=null)=>{
    let targets = devices.map((item)=>({title:item.name, data:item}))
    targets.unshift({title:"datetime", data:{type:"datetime"}})
    dialog.show("confirmation",{
      title:"Devices",
      items:targets,
      active:(d)=>{
        if(typeof(result)==="function")
          result(d)
        dialog.hide()
      }
    })
  }

  const typeAct = (result=null)=>{
    let items = [
      {title: "device", data: "device"},
      {title: "script", data: "script"},
      {title: "delay", data: "delay"},
    ]
    dialog.show("confirmation",{
      title:"typeAct",
      items:items,
      active:(d)=>{
        if(typeof(result)==="function")
          result(d)
        dialog.hide()
      }
    })
  }

  const typeIf = (result=null)=>{
    let items = [
      {title: "group Block And", data: "groupBlockAnd"},
      {title: "group Block Or", data: "groupBlockOr"},
      {title: "device", data: "deviceBlock"},
    ]
    dialog.show("confirmation",{
      title:"typeAct",
      items:items,
      active:(d)=>{
        dialog.hide()
        if(typeof(result)==="function")
          result(d)
      }
    })
  }

  const addScriptBlock = async(result=null)=>{
    let items = await request('/api/script/all', 'GET', null,{Authorization: `Bearer ${auth.token}`})
    items = items.map((item)=>({title:item.name, data:item}))
    dialog.show("confirmation",{
      title:"typeAct",
      items:items,
      active:(d)=>{
        dialog.hide()
        if(typeof(result)==="function")
          result(d)
      }
    })
  }

  const typeValue = (type, data, result=null)=>{
    let items = []
    if(type==="addValue"&& data.type==="text")
      items.push({title: "input text", data: "Text"})
    if(data.type==="number" || type==="addValueMath")
      items.push({title: "input number", data: "Number"})
    if(type==="addValueMath" || data.type==="number")
      items.push({title: "Mathematical expression", data: "Math"})
    if(data.type!=="enum")
      items.push({title: "Device value", data: "DeviceValue"})
    if(data.type==="enum" || data.type==="binary")
      items.push({title: "state value", data: "Enum"})
    dialog.show("confirmation",{
      title:"typeAct",
      items:items,
      active:(d)=>{
        dialog.hide()
        if(typeof(result)==="function")
          result(d)
      }
    })
  }

  useEffect(()=>{
    message(error,"error")
    return ()=>{
      clearError();
    }
  },[error,message, clearError])

  return(
    <AddScriptContext.Provider
    value={{typeValue,addTarget,typeAct,deviceBlock,typeIf,addScriptBlock}}>
      {children}
    </AddScriptContext.Provider>
  )
}
