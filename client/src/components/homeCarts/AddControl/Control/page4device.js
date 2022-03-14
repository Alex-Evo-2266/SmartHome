import React, {useState} from 'react'
import {ConfirmationDialog} from '../../../dialogWindow/dialogType/confirmationDialog'

const types = {
  sensor:["text","binary","number","enum"],
  button:["text","binary","number","enum"],
  slider:["number"],
  enum:["enum"],
  text:["text"]
}

function filtredField(data, typeField) {
  let condidats = data.fields
  if(typeField === "sensor")
    return condidats
  return condidats.filter(item=>(item.control && typeField in types && types[typeField].indexOf(item.type) !== -1))
}

export const Page4Device = ({type ,next, device, back, hide})=>{
  const [allField] = useState(filtredField(device, type));

  const transformation = (data)=>data.map(item=>({title:item.name, data:item}))

  return(
    <ConfirmationDialog
    hide={hide}
    text="choose a device."
    title="adds element"
    active={next}
    activeText="NEXT"
    buttons = {[{
      title:"BACK",
      action:back
    }]}
    items={transformation(allField)}/>
  )
}
