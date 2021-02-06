import React, {useState,useEffect} from 'react'
import {HidingLi} from '../../hidingLi.js'

export const DimmerMqtt = ({onChange})=>{

  const [power, setPower] = useState({
    type:"power",
    address:"",
    low:"0",
    high:"1"
  })
  const [dimmer, setDimmer] = useState({
    type:"dimmer",
    address:"",
    low:"0",
    high:"255"
  })
  const [status, setStatus] = useState({
    type:"status",
    address:""
  })


  const nextpage = ()=>{
    let arr = []
    if(power.address)
      arr.push(power)
    if(dimmer.address)
      arr.push(dimmer)
    if(status.address)
      arr.push(status)
    onChange(arr)
  }

  useEffect(()=>{
    nextpage()
  },[power,status,dimmer])

  const changeHandlerPower = event => {
    setPower({ ...power, [event.target.name]: event.target.value })
  }
  const changeHandlerDimmer = event => {
    setDimmer({ ...dimmer, [event.target.name]: event.target.value })
  }
  const changeHandlerStatus = event => {
    setStatus({ ...status, [event.target.name]: event.target.value })
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
          <HidingLi title = "power">
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
          <HidingLi title = "Dimmer" show = {true}>
          <label>
            <h5>Enter the topic by Dimmer</h5>
            <input className = "textInput" placeholder="topic Dimmer" id="dimmer" type="text" name="address" value={dimmer.address} onChange={changeHandlerDimmer} required/>
          </label>
          <label>
            <h5>Enter the min Dimmer</h5>
            <input className = "textInput" placeholder="min Dimmer" id="minDimmer" type="number" name="low" value={dimmer.low} onChange={changeHandlerDimmer} required/>
          </label>
          <label>
            <h5>Enter the max Dimmer</h5>
            <input className = "textInput" placeholder="max Dimmer" id="maxDimmer" type="number" name="high" value={dimmer.high} onChange={changeHandlerDimmer} required/>
          </label>
          </HidingLi>
        </ul>
      </div>
  )
}
