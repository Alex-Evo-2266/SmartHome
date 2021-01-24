import React, {useReducer} from 'react'
import {FormContext} from './formContext'
import {formReducer} from './formReducer'
import {SHOW_FORM, HIDE_FORM} from '../types'

export const FormState = ({children}) =>{
  const [state, dispatch] = useReducer(formReducer,{visible:false})

  const show = (type = "404", OK = null, id = null) =>{
    dispatch({
      type:SHOW_FORM,
      payload: {type,OK,id}
    })
  }

  const hide = () =>{
    dispatch({
      type:HIDE_FORM,
    })
  }

  return(
    <FormContext.Provider
    value={{show, hide, form: state}}>
      {children}
    </FormContext.Provider>
  )
}
