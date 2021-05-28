import React, {useState,useEffect} from 'react'
import {HidingLi} from '../../hidingLi.js'

export const RelayMqtt = ({onChange,type})=>{

  const [power, setPower] = useState({
    type:"power",
    address:(type==="json")?"state":"",
    low:"0",
    high:"1"
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
    nextpage([{ ...power, [event.target.name]: event.target.value }])
  }

  useEffect(()=>{
    nextpage([power])
  },[])

  return(
      <div className = "config">
        <ul>
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
