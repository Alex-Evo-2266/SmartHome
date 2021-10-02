import React, {useContext} from 'react'
import {ScriptContext} from '../../../../context/ScriptContext'
import {ConfirmationDialog} from '../../../dialogWindow/dialogType/confirmationDialog'

export const ScriptPage = ({hide, next, back})=>{
  const {scripts} = useContext(ScriptContext)

  const transformation = ()=>scripts.map(item=>({
    title:item.name,
    data:item
  }))

  return (
    <ConfirmationDialog
    hide={hide}
    text="choose a device."
    title="add element"
    active={next}
    activeText="NEXT"
    buttons = {[{
      title:"BACK",
      action:back
    }]}
    items={transformation(scripts)}/>
  )
}
