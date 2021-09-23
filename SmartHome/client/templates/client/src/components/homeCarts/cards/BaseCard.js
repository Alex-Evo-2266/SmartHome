import React,{useContext} from 'react'
import {CartEditContext} from '../EditCarts/CartEditContext'

export const BaseElement = ({
  children,
  index,
  data,
  dataType,
  onClick=()=>{}}) =>{
  const {target} = useContext(CartEditContext)

  return(
    <div
    className="baseElement"
    data-type={dataType}
    >
      <div className="Element" onClick={onClick}>
      {children}
      </div>
    </div>
  )
}
