import React, {useContext, useState, useContext} from 'react'
import {Switch} from '../../switch'
import {SocketContext} from '../../../context/SocketContext'

export const OtherDevice = ({device, onClick, added=false})=>{
  const [visible, setVisible] = useState(false)
  const {devices} = useContext(SocketContext)
  const [newvalue] = useState(false)

  return(
    <li name = "HidingLi" className={`hidingLi ${(visible)?"show":"hide"}`}>
      <h3 value = "HidingLi" className="LiTitle">{device?.name} {device?.systemName}</h3>
      <i value = "HidingLi" className={`iconAdded ${(added)?"added":""} fas fa-plus`} onClick={onClick}></i>
    </li>
  )
}
