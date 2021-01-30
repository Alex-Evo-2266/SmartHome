import React, {useState} from 'react'
import {HidingLi} from '../../../hidingLi.js'

export const LightMqttConf = ({next,back})=>{

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
  const [color, setColor] = useState({
    type:"color",
    address:"",
    low:"0",
    high:"255"
  })
  const [mode, setMode] = useState({
    type:"mode",
    address:"",
    low:"0",
    high:"2"
  })
  const [temp, setTemp] = useState({
    type:"temp",
    address:"",
    low:"0",
    high:"1"
  })

  const nextpage = ()=>{
    let arr = []
    if(power.address)
      arr.push(power)
    if(dimmer.address)
      arr.push(dimmer)
    if(color.address)
      arr.push(color)
    if(temp.address)
      arr.push(temp)
    if(status.address)
      arr.push(status)
    if(mode.address)
      arr.push(mode)
    next(arr)
  }

  const changeHandlerPower = event => {
    setPower({ ...power, [event.target.name]: event.target.value })
  }
  const changeHandlerDimmer = event => {
    setDimmer({ ...dimmer, [event.target.name]: event.target.value })
  }
  const changeHandlerColor = event => {
    setColor({ ...color, [event.target.name]: event.target.value })
  }
  const changeHandlerMode = event => {
    setMode({ ...mode, [event.target.name]: event.target.value })
  }
  const changeHandlerTemp = event => {
    setTemp({ ...temp, [event.target.name]: event.target.value })
  }
  const changeHandlerStatus = event => {
    setStatus({ ...status, [event.target.name]: event.target.value })
  }

  const errorbtn = ()=>{
    let input = document.getElementById("power");
    input.style.background="red"
    input.style.boxShadow="inset 0 0 10px #000"
  }

  return(
    <div className = "pageForm hide">
      <div className = "formContent moreInput">
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
          <HidingLi title = "lavel light">
          <label>
            <h5>Enter the topic by lavel light</h5>
            <input className = "textInput" placeholder="topic lavel light" id="lavelLight" type="text" name="address" value={dimmer.address} onChange={changeHandlerDimmer} required/>
          </label>
          <label>
            <h5>Enter the min light</h5>
            <input className = "textInput" placeholder="min light" id="minLight" type="number" name="low" value={dimmer.low} onChange={changeHandlerDimmer} required/>
          </label>
          <label>
            <h5>Enter the max light</h5>
            <input className = "textInput" placeholder="max light" id="maxLight" type="number" name="high" value={dimmer.high} onChange={changeHandlerDimmer} required/>
          </label>
          </HidingLi>
          <HidingLi title = "color">
          <label>
            <h5>Enter the topic by color</h5>
            <input className = "textInput" placeholder="topic color" id="color" type="text" name="address" value={color.address} onChange={changeHandlerColor} required/>
          </label>
          <label>
            <h5>Enter the min color</h5>
            <input className = "textInput" placeholder="min color" id="minColor" type="number" name="low" value={color.low} onChange={changeHandlerColor} required/>
          </label>
          <label>
            <h5>Enter the max color</h5>
            <input className = "textInput" placeholder="max color" id="maxColor" type="number" name="nigh" value={color.high} onChange={changeHandlerColor} required/>
          </label>
          </HidingLi>
          <HidingLi title = "temp">
          <label>
            <h5>Enter the topic by temp</h5>
            <input className = "textInput" placeholder="topic temp" id="temp" type="text" name="address" value={temp.address} onChange={changeHandlerTemp} required/>
          </label>
          <label>
            <h5>Enter the min temp</h5>
            <input className = "textInput" placeholder="min temp" id="mintemp" type="number" name="low" value={temp.low} onChange={changeHandlerTemp} required/>
          </label>
          <label>
            <h5>Enter the max temp</h5>
            <input className = "textInput" placeholder="max temp" id="maxtemp" type="number" name="high" value={temp.high} onChange={changeHandlerTemp} required/>
          </label>
          </HidingLi>
          <HidingLi title = "mode">
          <label>
            <h5>Enter the topic by mode</h5>
            <input className = "textInput" placeholder="topic mode" id="mode" type="text" name="address" value={mode.address} onChange={changeHandlerMode} required/>
          </label>
          <label>
            <h5>Enter the count mode</h5>
            <input className = "textInput" placeholder="count mode" id="countMode" type="number" name="high" value={mode.high} onChange={changeHandlerMode} required/>
          </label>
          </HidingLi>
        </ul>
      </div>
      <div className="formFooter">
      {
        (!power.address)?
        <button onClick={errorbtn} className ='FormControlBtn right disabled'>Next <i className="fas fa-arrow-right"></i></button>
        :
        <button onClick={nextpage} className ='FormControlBtn right' disabled = {!power.address}>Next <i className="fas fa-arrow-right"></i></button>
      }
        <button onClick={back} className ="FormControlBtn left"><i className="fas fa-arrow-left"></i> Previous</button>
      </div>
    </div>
  )
}
