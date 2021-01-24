import React, {useReducer} from 'react'
import {AddControlContext} from './AddControlContext'
import {addControlReducer} from './AddControlReducer'
import {SHOW_ADDCONTROL, HIDE_ADDCONTROL} from '../../types'

export const AddControlState = ({children}) =>{
  const [state, dispatch] = useReducer(addControlReducer,{visible:false})

  const show = (type = "AddButton" ,OK = null) =>{
    dispatch({
      type:SHOW_ADDCONTROL,
      payload: {type,OK}
    })
  }

  const hide = () =>{
    dispatch({
      type:HIDE_ADDCONTROL,
    })
  }
  const target = (type = "AddButton",OK = null) =>{
    if(state.visible){
      hide()
    }
    else {
      show(type,OK)
    }
  }

  return(
    <AddControlContext.Provider
    value={{show, hide, target,addControl: state}}>
      {children}
    </AddControlContext.Provider>
  )
}
