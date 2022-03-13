import React, {useState,useEffect,useContext} from 'react'
import {HidingLi} from '../../hidingLi.js'
import {SocketContext} from '../../../context/SocketContext'
import {GroupFormContext} from '../groupFormContext'
import {IconChoose} from '../../iconChoose'

export const EditField = ()=>{
  const {form, hide} = useContext(GroupFormContext)
  const {getDevice} = useContext(SocketContext)
  const [fields, setFields] = useState([])

  useEffect(()=>{
    setFields(form.group.fields)
  },[form.group])

  const gettypes = (name)=>{
    let arr = []
    for (var item of form.group.devices) {
      let dev = getDevice(item.name)
      for (var item2 of dev.config) {
        if(item2.name === name && !arr.includes(item2.type))
          arr.push(item2.type)
      }
    }
    return arr
  }

  const getcontrols = (name)=>{
    for (var item of form.group.devices) {
      let dev = getDevice(item.name)
      for (var item2 of dev.config) {
        if(item2.name === name && item2.control)
          return [true, false]
      }
    }
    return [false]
  }

  const changeHandlerField = event => {
    let index = event.target.dataset.id
    let arr = fields.slice()
    let newcom = { ...arr[index], [event.target.name]: event.target.value }
    arr[index] = newcom
    setFields(arr)
  }

  const changeIcon = (val, id) => {
    let index = id
    let arr = fields.slice()
    let newcom = { ...arr[index], icon: val}
    arr[index] = newcom
    setFields(arr)
  }

  const outHandler = async()=>{
    form.OK(fields, {...form.group, fields:fields})
    hide()
  }

  return (
    <div className="form">
      <div className="editDevicesForm">
        <ul className="editDevice">
          <li>
            <label>
              <h5>{`Name - ${form.group.name}`}</h5>
              <h5>{`systemName - ${form.group.systemName}`}</h5>
            </label>
          </li>
          {
            fields.map((item,index)=>{
              return(
                <HidingLi key={index} title = {item.name}>
                  <div className="configElement">
                    <div className="input-data">
                      <select data-id={index} name="type" value={item.type} onChange={changeHandlerField}>
                        {
                          gettypes(item.name).map((item2, index2)=>{
                            return (
                              <option key={index2} value={item2}>{item2}</option>
                            )
                          })
                        }
                      </select>
                    <label>type</label>
                  </div>
                </div>
                <div className="configElement">
                  <div className="input-data">
                    <select data-id={index} name="control" value={item.control} onChange={changeHandlerField}>
                    {
                      getcontrols(item.name).map((item2, index2)=>{
                        return (
                          <option key={index2} value={item2}>{String(item2)}</option>
                        )
                      })
                    }
                    </select>
                  <label>control</label>
                </div>
              </div>
                {
                  (item.type==="number"||item.type==="binary")?
                  <>
                  <div className="configElement">
                    <div className="input-data">
                      <input data-id={index} type={(item.type==="range")?"number":"text"} name="low" value={item.low} onChange={changeHandlerField} required/>
                      <label>min</label>
                    </div>
                  </div>
                  <div className="configElement">
                    <div className="input-data">
                      <input data-id={index} type={(item.type==="range")?"number":"text"} name="high" value={item.high} onChange={changeHandlerField} required/>
                      <label>max</label>
                    </div>
                  </div>
                  </>:
                  (item.type==="enum")?
                  <div className="configElement">
                    <div className="input-data">
                      <input data-id={index} type="text" name="values" value={item.values} onChange={changeHandlerField} required/>
                      <label>enum</label>
                    </div>
                  </div>
                  :null
                }
                <IconChoose dataId={index} value={item.icon} onChange={changeIcon}/>
                {
                  (item.type==="number")?
                  <div className="configElement">
                    <div className="input-data">
                      <input data-id={index} name="unit" value={item.unit} onChange={changeHandlerField} required/>
                      <label>unit</label>
                    </div>
                  </div>:null
                }
                </HidingLi>
              )
            })
          }
          <div className="controlForm" >
            <button className="formEditBtn" onClick={outHandler}>Save</button>
          </div>
        </ul>
      </div>
    </div>
  )

}
