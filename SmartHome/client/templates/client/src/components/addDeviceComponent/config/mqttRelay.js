import React, {useState} from 'react'
import {HidingLi} from '../../hidingLi.js'

export const RelayMqtt = ({onChange})=>{

  const [power, setPower] = useState({
    type:"power",
    address:"",
    low:"0",
    high:"1"
  })
  const [status, setStatus] = useState({
    type:"status",
    address:""
  })

  const nextpage = (param)=>{
    let arr = []
    for (var item of param) {
      if(item.address)
        arr.push(item)
    }
    onChange(arr)
  }

  const changeHandlerPower = event => {
    setPower({ ...power, [event.target.name]: event.target.value })
    nextpage([{ ...power, [event.target.name]: event.target.value },status])
  }
  const changeHandlerStatus = event => {
    setStatus({ ...status, [event.target.name]: event.target.value })
    nextpage([{ ...status, [event.target.name]: event.target.value },power])
  }

  return(
      <div className = "config">
        <ul>
          <li>
          <label>
            <h5>Enter the topic by status</h5>
            <input className = "textInput" placeholder="topic status" id="status" type="text" name="address" value={status.address} onChange={changeHandlerStatus} required/>
          </label>
          </li>
          <HidingLi title = "power" show = {true}>
          <label>
            <h5>Enter the topic by power</h5>
            <input className = "textInput" placeholder="topic power" id="power" type="text" name="address" value={power.address} onChange={changeHandlerPower} required/>
          </label>
          <label>
            <h5>Enter the turn on signal</h5>
            <input className = "textInput" placeholder="turn On" id="turnOn" type="text" name="high" value={power.high} onChange={changeHandlerPower} required/>
          </label>
          <label>
            <h5>Enter the turn off signal</h5>
            <input className = "textInput" placeholder="turn Off" id="turnOff" type="text" name="low" value={power.low} onChange={changeHandlerPower} required/>
          </label>
          </HidingLi>
        </ul>
      </div>
  )
}
