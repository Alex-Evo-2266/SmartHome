import React, {useState} from 'react'
import {HidingLi} from '../../../hidingLi.js'

export const SwitchMqttConf = ({next,back})=>{

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

  const nextpage = ()=>{
    let arr = []
    if(power.address)
      arr.push(power)
    if(status.address)
      arr.push(status)
    next(arr)
  }

  const changeHandlerPower = event => {
    setPower({ ...power, [event.target.name]: event.target.value })
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
            <h5>Enter the topic by power status</h5>
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
            <input className = "textInput" placeholder="turn On" id="turnOn" type="text" name="hight" value={power.hight} onChange={changeHandlerPower} required/>
          </label>
          <label>
            <h5>Enter the turn off signal</h5>
            <input className = "textInput" placeholder="turn Off" id="turnOff" type="text" name="low" value={power.low} onChange={changeHandlerPower} required/>
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
