import React,{useContext} from 'react'
import {BaseElement} from './BaseElement'
import {ServerConfigContext} from  '../../../context/ServerConfigContext'

export const TimeElement = ({data,className,index,children,name,onClick,editBtn,deleteBtn}) =>{
  const serverConfig = useContext(ServerConfigContext)

  return(
    <BaseElement
    deleteBtn = {(data.editmode)?deleteBtn:null}
    editBtn={(data.editmode)?editBtn:null}
    index={index}
    data={data.data}
    >
    <p className="sensor-value">{serverConfig.time || `${new Date().getHours()}:${new Date().getMinutes()}`}</p>
    </BaseElement>
  )
}
