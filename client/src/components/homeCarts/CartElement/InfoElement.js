import React from 'react'
import {BaseElement} from './BaseElement'

export const InfoElement = ({name, value, unit,children,deleteBtn,editBtn,index,data}) =>{
  return(
    <BaseElement deleteBtn={deleteBtn} editBtn={editBtn} index={index} data={data}>
      <div className="info-box">
        <p className="name">{name}</p>
        {children}
        <p className="value">{value}</p>
        <p className="unit">{unit}</p>
      </div>
    </BaseElement>
  )
}
