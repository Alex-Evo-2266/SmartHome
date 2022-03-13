import React, {useContext, useState, useEffect, useCallback} from 'react'
import {GroupFormContext} from '../groupFormContext'
import {Device} from './deviceEl'
import {SocketContext} from '../../../context/SocketContext'
import {useHttp} from '../../../hooks/http.hook'
import {AuthContext} from '../../../context/AuthContext.js'
import {useMessage} from '../../../hooks/message.hook'

export const AddDevice = ()=>{
  const {form, hide} = useContext(GroupFormContext)
  const auth = useContext(AuthContext)
  const {devices} = useContext(SocketContext)
  const [groupDevice, setGroupDevice] = useState([])
  const [fields, setFields] = useState([])
  const {message} = useMessage();
  const {request, error, clearError} = useHttp();

  const dev = (systemName)=>devices.filter((item2)=>item2.systemName === systemName)[0]

  useEffect(()=>{
    message(error,"error")
    return ()=>{
      clearError();
    }
  },[error,message, clearError])

  const otherdev = ()=>{
    let arr = devices
    for (var item of groupDevice) {
      arr = arr.filter((item2)=>item2.systemName !== item.name)
    }
    return arr
  }

  useEffect(()=>{
    setGroupDevice(form.group.devices)
    setFields(form.group.fields)
  },[form.group])

  const outHandler = async()=>{
    form.OK(groupDevice, {...form.group, devices:groupDevice, fields})
    hide()
  }

  const getGroupDevice = (groupdevices) => devices.filter((item)=>groupdevices.includes(item.systemName))

  const getfields  = (fieldsList, fields) => {
    let arr = fieldsList.slice()
    for (var item of fields) {
      if (arr.filter((item2)=>item.name === item2.name).length === 0)
        arr.push(item)
    }
    return arr
  }

  const updataField = (groupdevices)=>{
    let groupdev = getGroupDevice(groupdevices.map(item => item.name))
    // let arr = fields.slice()
    let arr = []
    for (var item of groupdev) {
      arr = getfields(arr, item.config)
    }
    arr = arr.map(item => ({
      name: item.name,
      type: item.type,
      low: item.low,
      high: item.high,
      values: item.values,
      control: item.control,
      icon: item.icon,
      unit: item.unit,
    }))
    console.log(arr);
    setFields(arr)
  }

  const add = (item)=>{
    let arr = groupDevice.slice()
    arr.push({
      name:item.systemName,
      fields:item.config.map(
        (item)=>({name:item.name, type:item.type})
      )
    })
    setGroupDevice(arr)
    updataField(arr)
  }

  const del = (item)=>{
    let groupdevices = groupDevice.filter((item2)=>item2.name !==item.name)
    setGroupDevice(groupdevices)
    updataField(groupdevices)
  }

  const setDevice = (data)=>{
    setGroupDevice(groupDevice.map(item => (item.name === data.name)?data:item))
  }

  return (
    <div className="form">
      <div className="editDevicesForm">
        <h4>added device</h4>
            {
              (groupDevice.length === 0)?
                <p>not element</p>
              :
              groupDevice.map((item,index)=>{
                return(
                  <Device key={index} device={dev(item.name)} onClick={()=>del(item)} groupDevice={item} setGroupDevice={setDevice} added={true}/>
                )
              })
            }
        <h4>other device</h4>
            {
              otherdev().map((item,index)=>{
                return(
                  <Device key={index} device={item} onClick={()=>add(item)}/>
                )
              })
            }
        <div className="controlForm" >
          <button className="formEditBtn" onClick={outHandler}>Save</button>
        </div>
      </div>
    </div>
  )
}
