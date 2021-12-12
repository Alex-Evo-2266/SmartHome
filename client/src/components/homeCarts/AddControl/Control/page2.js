import React, {useContext,useState} from 'react'
import {SocketContext} from '../../../../context/SocketContext'
import {ConfirmationDialog} from '../../../dialogWindow/dialogType/confirmationDialog'

const types = {
  sensor:["text","binary","number","enum"],
  button:["text","binary","number","enum"],
  slider:["number"],
  enum:["enum"],
  text:["text"]
}

function filtred(data, typeField) {
  if(typeField === "sensor")
    return data
  let condidats = data.filter(item=>item.type!=="sensor")
  let filtredData = []
  for (var item of condidats) {
    for (var item2 of item.config) {
      if(item2.control && typeField in types && types[typeField].indexOf(item2.type) !== -1){
        filtredData.push(item)
        break
      }
    }
  }
  return filtredData
}

export const Page2 = ({type ,next, back, hide})=>{
  const {devices} = useContext(SocketContext)
  const [allDevices] = useState(filtred(devices, type));

  const transformation = (data)=>data.map(item=>({title:item.name, data:item}))

  return(
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
    items={transformation(allDevices)}/>
  )
}
