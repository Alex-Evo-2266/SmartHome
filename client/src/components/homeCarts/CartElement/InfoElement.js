import React from 'react'
import {BaseElement} from './BaseElement'

export const InfoElement = ({data,className,index,children,name,onClick,editBtn,deleteBtn}) =>{
  return(
    <BaseElement
    deleteBtn = {(data.editmode)?deleteBtn:null}
    editBtn={(data.editmode)?editBtn:null}
    index={index}
    data={data.data}
    >
      <div className="info-box">
        <p className="name">{data.field.name}</p>
        {children}
        <p className="value">{data.fieldvalue}</p>
        <p className="unit">{data.field.unit}</p>
      </div>
    </BaseElement>
  )
}
