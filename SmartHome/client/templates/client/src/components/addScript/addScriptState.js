import React, {useReducer,useContext} from 'react'
import {AddScriptContext} from './addScriptContext'
import {addScriptReducer} from './addScriptReducer'
import {DialogWindowContext} from '../dialogWindow/dialogWindowContext'
import {SocketContext} from '../../context/SocketContext'
import {SHOW_ADDSCRIPT, HIDE_ADDSCRIPT} from '../types'

export const AddScriptState = ({children}) =>{
  const dialog = useContext(DialogWindowContext)
  const {devices} = useContext(SocketContext)
  const [state, dispatch] = useReducer(addScriptReducer,{visible:false})

  const addTarget = (result=null)=>{
    let targets = devices.map((item)=>({title:item.DeviceName, data:item}))
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
    value={{show, hide,showData,addTarget, addScript: state}}>
      {children}
    </AddScriptContext.Provider>
  )
}
