import React, {useContext} from 'react'
import {FormContext} from './formContext'
import {EditDevicesForm} from './forms/editDevicesForm'
import {BackForm} from '../moduls/backForm'
import {EditUserLevel} from './forms/editUserLevel'

export const Form = ()=>{
  const {form, hide} = useContext(FormContext)

  if(!form.visible){
    return null;
  }

  const hideAndApdata = () =>{
    hide();
    if(form.OK){
      form.OK()
    }
  }

  if(form.type === "EditDevices"){
    return (
      <BackForm onClick = {hide}>
        <EditDevicesForm hide = {hideAndApdata} id = {form.data.DeviceId}/>
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
}
