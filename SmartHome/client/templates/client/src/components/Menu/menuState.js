import React, {useReducer, useCallback} from 'react'
import {MenuContext} from './menuContext'
import {menuReducer} from './menuReducer'
import {SHOW_MENU, HIDE_MENU, EDIT_MENU} from '../types'

export const MenuState = ({children}) =>{
  const [state, dispatch] = useReducer(menuReducer,{visible:false})

  const setData = useCallback((title="",options={}) =>{
    dispatch({
      type:EDIT_MENU,
      payload: {title,...options}
    })
  },[])

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
    value={{show, hide, togle,setData, menu: state}}>
      {children}
    </MenuContext.Provider>
  )
}
