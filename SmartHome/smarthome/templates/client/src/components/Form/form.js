import React, {useContext} from 'react'
import {FormContext} from './formContext'
import {AddDevicesForm} from './forms/addDevicesForm'
import {EditDevicesForm} from './forms/editDevicesForm'
import {BackForm} from '../moduls/backForm'

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

  if(form.type === "AddDevices"){
    return (
      <BackForm onClick = {hide}>
        <AddDevicesForm hide = {hideAndApdata}/>
      </BackForm>
    )
  }
  if(form.type === "EditDevices"){
    return (
      <BackForm onClick = {hide}>
        <EditDevicesForm hide = {hideAndApdata} id = {form.id}/>
      </BackForm>
    )
  }
}
