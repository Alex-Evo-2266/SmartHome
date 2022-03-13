import React from 'react'
import {ConfirmationDialog} from '../../../dialogWindow/dialogType/confirmationDialog'

const types = [
  {title:"device", data:"device"},
  {title:"group", data:"group"}
]

export const Page2 = ({type ,next, back, hide})=>{

  return(
    <ConfirmationDialog
    hide={hide}
    text="choose a item."
    title="add element"
    active={next}
    activeText="NEXT"
    buttons = {[{
      title:"BACK",
      action:back
    }]}
    items={types}/>
  )
}
