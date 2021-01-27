import React, {useReducer} from 'react'
import {AddScriptContext} from './addScriptContext'
import {addScriptReducer} from './addScriptReducer'
import {SHOW_ADDSCRIPT, HIDE_ADDSCRIPT} from '../types'

export const AddScriptState = ({children}) =>{
  const [state, dispatch] = useReducer(addScriptReducer,{visible:false})

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
    value={{show, hide,showData, addScript: state}}>
      {children}
    </AddScriptContext.Provider>
  )
}
