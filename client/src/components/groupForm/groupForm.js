import React, {useContext} from 'react'
import {GroupFormContext} from './groupFormContext'
import {BackForm} from '../backForm'
import {AddDevice} from './addDeviceInGroup/addDeviceinGroup'

export const GroupForm = ()=>{
  const {form, hide} = useContext(GroupFormContext)

  if(!form.visible){
    return null;
  }

  const hideAndApdata = (t=null) =>{
    hide();
    if(form.OK){
      form.OK(t)
    }
  }

  if(form.type === "deviceInGroup"){
    return (
      <BackForm onClick = {hide}>
        <AddDevice hide = {hideAndApdata}/>
      </BackForm>
    )
  }

  // if(form.type === "editGroup"){
  //   return (
  //     <BackForm onClick = {hide}>
  //       <EditGroup hide = {hideAndApdata}/>
  //     </BackForm>
  //   )
  // }
}
