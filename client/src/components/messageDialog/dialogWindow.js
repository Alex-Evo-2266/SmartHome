import React from 'react'
import {TextDialog} from './dialogType/textDialog'
import {ConfirmationDialog} from './dialogType/confirmationDialog'
import {AlertDialog} from './dialogType/alertDialog'
import { hide } from '../../store/reducers/dialogReducer'
import { useDispatch, useSelector } from 'react-redux'

export const DialogWindow = ()=>{
  const dialog = useSelector(state => state.dialog)
  const dispatch = useDispatch()

  if(!dialog.visible){
    return null;
  }

  if(dialog.type === "alert")
    return(<AlertDialog hide={()=>dispatch(hide())} text={dialog.text} title={dialog.title} buttons={dialog.buttons}/>)

  if(dialog.type === "text")
    return(<TextDialog hide={()=>dispatch(hide())} text={dialog.text} title={dialog.title} active={dialog.active} placeholder={dialog.placeholder}/>)

  if(dialog.type === "confirmation")
    return(<ConfirmationDialog hide={()=>dispatch(hide())} text={dialog.text} title={dialog.title} active={dialog.active} items={dialog.items}/>)

  return null

}
