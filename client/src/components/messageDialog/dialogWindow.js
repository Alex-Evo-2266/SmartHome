import React from 'react'
import {TextDialog} from './dialogType/textDialog'
import {ConfirmationDialog} from './dialogType/confirmationDialog'
import {AlertDialog} from './dialogType/alertDialog'
import { hide } from '../../store/reducers/dialogReducer'
import { useDispatch, useSelector } from 'react-redux'
import { BaseModalWindow } from '../modalWindow/modalWindowBase'
import { CastomDialog } from './dialogType/castomDialog'

export const DialogWindow = ()=>{
  const dialog = useSelector(state => state.dialog)
  const dispatch = useDispatch()

  return (
    <BaseModalWindow visible={dialog.visible} hide={()=>dispatch(hide())}>
    {
      (dialog.type === "alert")?
      <AlertDialog hide={()=>dispatch(hide())} text={dialog.text} title={dialog.title} buttons={dialog.buttons}/>:
      (dialog.type === "text")?
      <TextDialog hide={()=>dispatch(hide())} text={dialog.text} title={dialog.title} placeholder={dialog.placeholder} active={dialog.active} defText={dialog.defText}/>:
      (dialog.type === "confirmation")?
      <ConfirmationDialog hide={()=>dispatch(hide())} text={dialog.text} title={dialog.title} active={dialog.active} items={dialog.items}/>:
      (dialog.type === "html")?
      <CastomDialog hide={()=>dispatch(hide())} html={dialog.html} title={dialog.title} buttons={dialog.buttons}/>:
      null
    }
    </BaseModalWindow>
  )
}
