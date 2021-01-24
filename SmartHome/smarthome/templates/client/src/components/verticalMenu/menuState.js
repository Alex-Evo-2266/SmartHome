import React, {useReducer} from 'react'
import {MenuContext} from './menuContext'
import {menuReducer} from './menuReducer'
import {SHOW_MENU, HIDE_MENU} from '../types'

export const MenuState = ({children}) =>{
  const [state, dispatch] = useReducer(menuReducer,{visible:false})

  const show = () =>{
    dispatch({
      type:SHOW_MENU
    })
  }

  const hide = () =>{
    dispatch({
      type:HIDE_MENU
    })
  }

  const togle = () =>{
    if(state.visible){
      dispatch({
        type:HIDE_MENU
      })
    }
    else {
      dispatch({
        type:SHOW_MENU
      })
    }
  }

  return(
    <MenuContext.Provider
    value={{show, hide, togle, menu: state}}>
      {children}
    </MenuContext.Provider>
  )
}
