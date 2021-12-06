import React, {useContext} from 'react'
import {FormContext} from './formContext'
import {EditDevicesForm} from './forms/editDevicesForm'
import {LincDevicesForm} from './forms/lincDevicesForm'
import {BackForm} from '../backForm'
import {EditUserLevel} from './forms/editUserLevel'
import {CreateStyle} from './forms/CreateStyle'

export const Form = ()=>{
  const {form, hide} = useContext(FormContext)

  if(!form.visible){
    return null;
  }

  const hideAndApdata = (t=null) =>{
    hide();
    if(form.OK){
      form.OK(t)
    }
  }

  if(form.type === "EditDevices"){
    return (
      <BackForm onClick = {hide}>
        <EditDevicesForm hide = {hideAndApdata} systemName = {form.data.systemName}/>
      </BackForm>
    )
  }

  if(form.type === "LinkDevices"){
    return (
      <BackForm onClick = {hide}>
        <LincDevicesForm hide = {hideAndApdata} data = {form.data}/>
      </BackForm>
    )
  }

  if(form.type === "EditUserLevel"){
    return (
      <BackForm onClick = {hide}>
        <EditUserLevel hide = {hideAndApdata} data = {form.data}/>
      </BackForm>
    )
  }

  if(form.type === "CreateStyle"){
    return (
      <BackForm onClick = {hide}>
        <CreateStyle hide = {hideAndApdata} ret={form.OK}/>
      </BackForm>
    )
  }
}
