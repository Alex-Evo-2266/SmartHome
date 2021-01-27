import React, {useState} from 'react'
import {HidingLi} from '../../../hidingLi.js'

export const LightMqttConf = ({next,back})=>{

  const [form, setForm] = useState({
    power: '',
    status:'',
    turnOnSignal:'1',
    turnOffSignal:'0',
    dimmer:'',
    minDimmer:0,
    maxDimmer:255,
    color:'',
    minColor:0,
    maxColor:255,
    mode:'',
    countMode:2,
  });

  const nextpage = ()=>{
    next(form)
  }

  const changeHandler = event => {
    setForm({ ...form, [event.target.name]: event.target.value })
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
              <input className = "textInput" placeholder="topic status" id="status" type="text" name="status" value={form.status} onChange={changeHandler} required/>
            </label>
          </li>
          <HidingLi title = "power">
          <label>
            <h5>Enter the topic by power</h5>
            <input className = "textInput" placeholder="topic power" id="power" type="text" name="power" value={form.power} onChange={changeHandler} required/>
          </label>
          <label>
            <h5>Enter the turn on signal</h5>
            <input className = "textInput" placeholder="turn On" id="turnOn" type="text" name="turnOnSignal" value={form.turnOnSignal} onChange={changeHandler} required/>
          </label>
          <label>
            <h5>Enter the turn off signal</h5>
            <input className = "textInput" placeholder="turn Off" id="turnOff" type="text" name="turnOffSignal" value={form.turnOffSignal} onChange={changeHandler} required/>
          </label>
          </HidingLi>
          <HidingLi title = "lavel light">
          <label>
            <h5>Enter the topic by lavel light</h5>
            <input className = "textInput" placeholder="topic lavel light" id="lavelLight" type="text" name="dimmer" value={form.dimmer} onChange={changeHandler} required/>
          </label>
          <label>
            <h5>Enter the min light</h5>
            <input className = "textInput" placeholder="min light" id="minLight" type="number" name="minDimmer" value={form.minDimmer} onChange={changeHandler} required/>
          </label>
          <label>
            <h5>Enter the max light</h5>
            <input className = "textInput" placeholder="max light" id="maxLight" type="number" name="maxDimmer" value={form.maxDimmer} onChange={changeHandler} required/>
          </label>
          </HidingLi>
          <HidingLi title = "color">
          <label>
            <h5>Enter the topic by color</h5>
            <input className = "textInput" placeholder="topic color" id="color" type="text" name="color" value={form.color} onChange={changeHandler} required/>
          </label>
          <label>
            <h5>Enter the min color</h5>
            <input className = "textInput" placeholder="min color" id="minColor" type="number" name="minColor" value={form.minColor} onChange={changeHandler} required/>
          </label>
          <label>
            <h5>Enter the max color</h5>
            <input className = "textInput" placeholder="max color" id="maxColor" type="number" name="maxColor" value={form.maxColor} onChange={changeHandler} required/>
          </label>
          </HidingLi>
          <HidingLi title = "mode">
          <label>
            <h5>Enter the topic by mode</h5>
            <input className = "textInput" placeholder="topic mode" id="mode" type="text" name="mode" value={form.mode} onChange={changeHandler} required/>
          </label>
          <label>
            <h5>Enter the count mode</h5>
            <input className = "textInput" placeholder="count mode" id="countMode" type="number" name="countMode" value={form.countMode} onChange={changeHandler} required/>
          </label>
          </HidingLi>
        </ul>
      </div>
      <div className="formFooter">
      {
        (!form.power)?
        <button onClick={errorbtn} className ='FormControlBtn right disabled'>Next <i className="fas fa-arrow-right"></i></button>
        :
        <button onClick={nextpage} className ='FormControlBtn right' disabled = {!form.power}>Next <i className="fas fa-arrow-right"></i></button>
      }
        <button onClick={back} className ="FormControlBtn left"><i className="fas fa-arrow-left"></i> Previous</button>
      </div>
    </div>
  )
}
