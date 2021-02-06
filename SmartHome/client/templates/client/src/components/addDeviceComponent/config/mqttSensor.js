import React, {useState} from 'react'
import {HidingLi} from '../../hidingLi.js'

export const SensorMqtt = ({onChange,back})=>{

  const [status, setStatus] = useState({
    type:"status",
    address:'',
    icon:""
  });

  const nextpage = ()=>{
    onChange([status])
  }

  const changeHandler = event => {
    setStatus({ ...status, [event.target.name]: event.target.value })
    nextpage()
  }

  return(
      <div className = "config">
        <ul>
          <HidingLi title = "sensor config" show = {true}>
          <label>
            <h5>Enter the topic by status</h5>
            <input className = "textInput" placeholder="topic status" id="status" type="text" name="address" value={status.address} onChange={changeHandler} required/>
          </label>
          <label>
            <h5>Enter the unit</h5>
            <input className = "textInput" placeholder="unit" id="unit" type="text" name="icon" value={status.icon} onChange={changeHandler} required/>
          </label>
          </HidingLi>
        </ul>
      </div>
  )
}
