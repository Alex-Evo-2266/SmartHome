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
  if(cartEdit.type==="button"){
    return(
      <ButtonEdit/>
    )
  }
  return null;

}
