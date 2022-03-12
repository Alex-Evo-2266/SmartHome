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
  },[form.group.devices])

  const outHandler = async()=>{
    form.OK(groupDevice, {...form.group, devices:groupDevice})
    hide()
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
  }

  const del = (item)=>{
    setGroupDevice(groupDevice.filter((item2)=>item2.name !==item.name))
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
