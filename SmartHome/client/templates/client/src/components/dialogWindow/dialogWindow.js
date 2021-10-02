import React, {useContext} from 'react'
import {DialogWindowContext} from './dialogWindowContext'
import {TextDialog} from './dialogType/textDialog'
import {ConfirmationDialog} from './dialogType/confirmationDialog'
import {AlertDialog} from './dialogType/alertDialog'

export const DialogWindow = ()=>{
  const {dialog, hide} = useContext(DialogWindowContext)

  if(!dialog.visible){
    return null;
  }

  if(dialog.type === "alert")
    return(<AlertDialog hide={hide} text={dialog.text} title={dialog.title} buttons={dialog.buttons}/>)

  if(dialog.type === "text")
    return(<TextDialog hide={hide} text={dialog.text} title={dialog.title} active={dialog.action} placeholder={dialog.placeholder}/>)

  if(dialog.type === "confirmation")
    return(<ConfirmationDialog hide={hide} text={dialog.text} title={dialog.title} active={dialog.active} items={dialog.items}/>)

  return null

}
