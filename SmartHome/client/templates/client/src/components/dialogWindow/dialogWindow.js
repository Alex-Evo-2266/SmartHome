import React, {useContext,useState} from 'react'
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
    return(<AlertDialog/>)

  if(dialog.type === "text")
    return(<TextDialog/>)

  if(dialog.type === "confirmation")
    return(<ConfirmationDialog/>)

  return null

}
