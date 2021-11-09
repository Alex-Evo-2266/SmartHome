import React,{useContext} from 'react'
import {BaseElement} from './BaseElement'
import {ServerConfigContext} from  '../../../context/ServerConfigContext'

export const TimeElement = ({deleteBtn,editBtn,index,data}) =>{
  const serverConfig = useContext(ServerConfigContext)

  return(
    <BaseElement
    deleteBtn = {deleteBtn}
    editBtn={editBtn}
    index={index}
    data={data}
    >
    <p className="sensor-value">{serverConfig.time || `${new Date().getHours()}:${new Date().getMinutes()}`}</p>
    </BaseElement>
  )
}