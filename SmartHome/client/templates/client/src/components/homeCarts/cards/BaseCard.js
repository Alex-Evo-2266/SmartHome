import React,{useContext} from 'react'
import {CartEditContext} from '../EditCarts/CartEditContext'

export const BaseElement = ({
  children,
  index,
  data,
  onDragStart,
  onDragLeave,
  onDragEnd,
  onDragOver,
  onDrop,
  onClick=()=>{}}) =>{
  const {target} = useContext(CartEditContext)

  return(
    <div
    className="baseElement"
    draggable={true}
    onDragStart={onDragStart}
    onDragLeave={onDragLeave}
    onDragEnd={onDragEnd}
    onDragOver={onDragOver}
    onDrop={onDrop}
    data-el='drag'
    >
      <div className="Element" onClick={onClick}>
      {children}
      </div>
    </div>
  )
}
