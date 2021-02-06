import React, {useState} from 'react'
import {HidingLi} from '../../hidingLi.js'

export const BinarySensorMqtt = ({onChange,back})=>{

  const [status, setStatus] = useState({
    type:"status",
    address:'',
  });

  const changeHandler = event => {
    let s = { ...status, [event.target.name]: event.target.value }
    setStatus(s)
    onChange([s])
  }

  return(
      <div className = "config">
        <ul>
          <HidingLi title = "sensor config" show = {true}>
          <label>
            <h5>Enter the topic by status</h5>
            <input className = "textInput" placeholder="topic status" id="status" type="text" name="address" value={status.address} onChange={changeHandler} required/>
          </label>
          </HidingLi>
        </ul>
      </div>
  )
}
