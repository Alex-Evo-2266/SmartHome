import React, {useState,useEffect} from 'react'
import {HidingLi} from '../../hidingLi.js'

export const LightMqtt = ({onChange,back,type})=>{

  const [power, setPower] = useState({
    type:"power",
    address:(type==="json")?"state":"",
    low:"0",
    high:"1"
  })
  const [dimmer, setDimmer] = useState({
    type:"dimmer",
    address:(type==="json")?"brightness":"",
    low:"0",
    high:"255"
  })
  const [color, setColor] = useState({
    type:"color",
    address:(type==="json")?"color":"",
    low:"0",
    high:"255"
  })
  const [mode, setMode] = useState({
    type:"mode",
    address:(type==="json")?"mode":"",
    low:"0",
    high:"2"
  })
  const [temp, setTemp] = useState({
    type:"temp",
    address:(type==="json")?"color_temp":"",
    low:"2700",
    high:"3200"
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
    nextpage([{ ...power, [event.target.name]: event.target.value },dimmer,color,mode,temp])
  }
  const changeHandlerDimmer = event => {
    setDimmer({ ...dimmer, [event.target.name]: event.target.value })
    nextpage([{ ...dimmer, [event.target.name]: event.target.value },power,color,mode,temp])
  }
  const changeHandlerColor = event => {
    setColor({ ...color, [event.target.name]: event.target.value })
    nextpage([{ ...color, [event.target.name]: event.target.value },dimmer,power,mode,temp])
  }
  const changeHandlerMode = event => {
    setMode({ ...mode, [event.target.name]: event.target.value })
    nextpage([{ ...mode, [event.target.name]: event.target.value },dimmer,color,power,temp])
  }
  const changeHandlerTemp = event => {
    setTemp({ ...temp, [event.target.name]: event.target.value })
    nextpage([{ ...temp, [event.target.name]: event.target.value },dimmer,color,mode,power])
  }

  useEffect(()=>{
    nextpage([power,dimmer,temp,color,mode])
  },[])

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
  )
}
