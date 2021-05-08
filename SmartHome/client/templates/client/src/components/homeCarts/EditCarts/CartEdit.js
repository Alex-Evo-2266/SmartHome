import React,{useContext} from 'react'
import {CartEditContext} from './CartEditContext'
import {BaseCartEdit} from './CartEditType/BaseCart'
import {ButtonEdit} from './CartEditType/Button'

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
      <ButtonEdit/>
    )
  }
  if(cartEdit.type==="button-line"){
    return(
      <ButtonEdit type="button-line"/>
    )
  }
  return null;

}
