import React, {useState} from 'react'
import {HidingLi} from '../../../hidingLi.js'

export const DimmerMqttConf = ({next,back})=>{

  const [form, setForm] = useState({
    power: '',
    status:'',
    turnOnSignal:'1',
    turnOffSignal:'0',
    dimmer:'',
    minDimmer:0,
    maxDimmer:255,
  });

  const nextpage = ()=>{
    next(form)
  }

  const changeHandler = event => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const errorbtn = ()=>{
    let input = document.getElementById("dimmer");
    input.style.background="red"
    input.style.boxShadow="inset 0 0 10px #000"
  }

  return(
    <div className = "pageForm hide">
      <div className = "formContent moreInput">
        <ul>
          <HidingLi title = "power" show = {true}>
          <label>
            <h5>Enter the topic by power</h5>
            <input className = "textInput" placeholder="topic power" id="power" type="text" name="power" value={form.power} onChange={changeHandler} required/>
          </label>
          <label>
            <h5>Enter the topic by power status</h5>
            <input className = "textInput" placeholder="topic status" id="status" type="text" name="status" value={form.status} onChange={changeHandler} required/>
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
          <HidingLi title = "Dimmer">
          <label>
            <h5>Enter the topic by Dimmer</h5>
            <input className = "textInput" placeholder="topic Dimmer" id="dimmer" type="text" name="dimmer" value={form.dimmer} onChange={changeHandler} required/>
          </label>
          <label>
            <h5>Enter the min Dimmer</h5>
            <input className = "textInput" placeholder="min Dimmer" id="minDimmer" type="number" name="minDimmer" value={form.minDimmer} onChange={changeHandler} required/>
          </label>
          <label>
            <h5>Enter the max Dimmer</h5>
            <input className = "textInput" placeholder="max Dimmer" id="maxDimmer" type="number" name="maxDimmer" value={form.maxDimmer} onChange={changeHandler} required/>
          </label>
          </HidingLi>
        </ul>
      </div>
      <div className="formFooter">
      {
        (!form.dimmer)?
        <button onClick={errorbtn} className ='FormControlBtn right disabled'>Next <i className="fas fa-arrow-right"></i></button>
        :
        <button onClick={nextpage} className ='FormControlBtn right' disabled = {!form.dimmer}>Next <i className="fas fa-arrow-right"></i></button>
      }
        <button onClick={back} className ="FormControlBtn left"><i className="fas fa-arrow-left"></i> Previous</button>
      </div>
    </div>
  )
}
