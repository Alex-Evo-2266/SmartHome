import React, {useReducer,useContext} from 'react'
import {AddScriptContext} from './addScriptContext'
import {addScriptReducer} from './addScriptReducer'
import {DialogWindowContext} from '../dialogWindow/dialogWindowContext'
import {SocketContext} from '../../context/SocketContext'
import {useScriptDevices} from './addScript/addScriptDevices'
import {useHttp} from '../../hooks/http.hook'
import {AuthContext} from '../../context/AuthContext.js'
import {SHOW_ADDSCRIPT, HIDE_ADDSCRIPT} from '../types'

export const AddScriptState = ({children}) =>{
  const dialog = useContext(DialogWindowContext)
  const {devices} = useContext(SocketContext)
  const auth = useContext(AuthContext)
  const {request, error, clearError} = useHttp();
  const {deviceBlock} = useScriptDevices()
  const [state, dispatch] = useReducer(addScriptReducer,{visible:false})

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

  const show = (type = "Devices", OK = null) =>{
    dispatch({
      type:SHOW_ADDSCRIPT,
      payload: {type,OK,data:null}
    })
  }

  const showData = (type = "Devices",data={}, OK = null) =>{
    dispatch({
      type:SHOW_ADDSCRIPT,
      payload: {type,OK,data}
    })
  }

  const hide = () =>{
    dispatch({
      type:HIDE_ADDSCRIPT,
    })
  }

  return(
    <AddScriptContext.Provider
    value={{show, hide,showData,typeValue,addTarget,typeAct,deviceBlock,typeIf,addScriptBlock, addScript: state}}>
      {children}
    </AddScriptContext.Provider>
  )
}
