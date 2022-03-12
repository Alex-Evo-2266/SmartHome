import React, {useReducer} from 'react'
import {GroupFormContext} from './groupFormContext'
import {formReducer} from './groupFormReducer'
import {SHOW_GROUP, HIDE_GROUP} from '../types'
import {GroupForm} from './groupForm'

export const GroupFormState = ({children}) =>{
  const [state, dispatch] = useReducer(formReducer,{visible:false})

  const show = (type = "deviceInGroup", group, OK) =>{
    dispatch({
      type:SHOW_GROUP,
      payload: {type,group,OK}
    })
  }

  const hide = () =>{
    dispatch({
      type:HIDE_GROUP,
    })
  }

  return(
    <GroupFormContext.Provider
    value={{show, hide, form: state}}>
      <GroupForm/>
      {children}
    </GroupFormContext.Provider>
  )
}
