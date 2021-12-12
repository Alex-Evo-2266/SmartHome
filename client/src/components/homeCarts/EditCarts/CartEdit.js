import React,{useContext} from 'react'
import {CartEditContext} from './CartEditContext'
import {BaseCartEdit} from './CartEditType/BaseCart'
import {ElementEdit} from './CartEditType/Element'

export const CartEdit = () =>{
  const {cartEdit} = useContext(CartEditContext)

  if(!cartEdit.visible||!cartEdit.type){
    return null;
  }

  if(cartEdit.type==="base"){
    return(
      <BaseCartEdit/>
    )
  }
  if(cartEdit.type==="line"){
    return(
      <BaseCartEdit type="line"/>
    )
  }
  if(cartEdit.type==="button"){
    return(
      <ElementEdit/>
    )
  }
  if(cartEdit.type==="button-line"){
    return(
      <ElementEdit type="button-line"/>
    )
  }
  return null;

}
