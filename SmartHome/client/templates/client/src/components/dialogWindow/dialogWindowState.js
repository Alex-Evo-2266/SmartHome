import React, {useReducer} from 'react'
import {DialogWindowContext} from './dialogWindowContext'
import {dialogWindowReducer} from './dialogWindowReducer'
import {SHOW_DIALOG, HIDE_DIALOG} from '../types'

export const DialogWindowState = ({children}) =>{
  const [state, dispatch] = useReducer(dialogWindowReducer,{visible:false})

  const show = (type = "warning", options={}) =>{
    dispatch({
      type:SHOW_DIALOG,
      payload: {type, ...options}
    })
  }

  const hide = () =>{
    dispatch({
      type:HIDE_DIALOG,
    })
  }

  return(
    <DialogWindowContext.Provider
    value={{show, hide, dialog: state}}>
      {children}
    </DialogWindowContext.Provider>
  )
}
