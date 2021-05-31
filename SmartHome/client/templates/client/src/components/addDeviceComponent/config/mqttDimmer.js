import React, {useState,useCallback} from 'react'
import {HidingLi} from '../../hidingLi.js'

export const DimmerMqtt = ({onChange=null})=>{

  const [power, setPower] = useState({
    type:"power",
    address:"",
    low:"0",
    high:"1",
    typeControl:"boolean"
  })
  const [dimmer, setDimmer] = useState({
    type:"dimmer",
    address:"",
    low:"0",
    high:"255",
    typeControl:"range"
  })



  const nextpage = useCallback((param)=>{
    let arr = []
    for (var item of param) {
      if(item.address)
        arr.push(item)
    }
    if(typeof(onChange)==='function')
      onChange(arr)
  },[onChange])

  const changeHandlerPower = event => {
    setPower({ ...power, [event.target.name]: event.target.value })
    nextpage([{ ...power, [event.target.name]: event.target.value },dimmer])
  }
  const changeHandlerDimmer = event => {
    setDimmer({ ...dimmer, [event.target.name]: event.target.value })
    nextpage([power,{ ...dimmer, [event.target.name]: event.target.value }])
  }

  return(
      <div className = "config">
        <ul>
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
