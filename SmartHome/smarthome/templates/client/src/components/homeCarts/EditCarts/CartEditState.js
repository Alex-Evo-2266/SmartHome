import React, {useReducer} from 'react'
import {CartEditContext} from './CartEditContext'
import {cartEditReducer} from './CartEditReducer'
import {SHOW_EDITCART, HIDE_EDITCART} from '../../types'

export const CartEditState = ({children}) =>{
  const [state, dispatch] = useReducer(cartEditReducer,{visible:false})

  const show = (type = "base", cart = null ,OK = null) =>{
    dispatch({
      type:SHOW_EDITCART,
      payload: {type,OK,cart}
    })
  }

  const hide = () =>{
    dispatch({
      type:HIDE_EDITCART,
    })
  }
  const target = (type = "base", cart = null ,OK = null) =>{
    if(state.visible){
      hide()
    }
    else {
      show(type,cart,OK)
    }
  }

  return(
    <CartEditContext.Provider
    value={{show, hide, target,cartEdit: state}}>
      {children}
    </CartEditContext.Provider>
  )
}
