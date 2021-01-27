import React, {useReducer} from 'react'
import {TerminalContext} from './terminalContext'
import {terminalReducer} from './terminalReducer'
import {SHOW_TERMINAL, HIDE_TERMINAL} from '../types'

export const TerminalState = ({children}) =>{
  const [state, dispatch] = useReducer(terminalReducer,{visible:false})

  const show = (type = "404",hide = null, OK = null) =>{
    dispatch({
      type:SHOW_TERMINAL,
      payload: {type,OK,hide}
    })
  }

  const hide = () =>{
    dispatch({
      type:HIDE_TERMINAL,
    })
  }

  const target = () =>{
    if(state.visible){
      hide()
    }
    else {
      show()
    }
  }

  return(
    <TerminalContext.Provider
    value={{show, hide,target, terminal: state}}>
      {children}
    </TerminalContext.Provider>
  )
}
