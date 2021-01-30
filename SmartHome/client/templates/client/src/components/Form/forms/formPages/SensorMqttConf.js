import React, {useState} from 'react'
import {HidingLi} from '../../../hidingLi.js'

export const SensorMqttConf = ({next,back})=>{

  const [status, setStatus] = useState({
    type:"status",
    address:'',
    icon:""
  });

  const nextpage = ()=>{
    next([status])
  }

  const changeHandler = event => {
    setStatus({ ...status, [event.target.name]: event.target.value })
  }

  const errorbtn = ()=>{
    let input = document.getElementById("status");
    input.style.background="red"
    input.style.boxShadow="inset 0 0 10px #000"
  }

  return(
    <div className = "pageForm hide">
      <div className = "formContent moreInput">
        <ul>
          <HidingLi title = "sensor config" show = {true}>
          <label>
            <h5>Enter the topic by status</h5>
            <input className = "textInput" placeholder="topic status" id="status" type="text" name="status" value={status.status} onChange={changeHandler} required/>
          </label>
          <label>
            <h5>Enter the unit</h5>
            <input className = "textInput" placeholder="unit" id="unit" type="text" name="unit" value={status.icon} onChange={changeHandler} required/>
          </label>
          </HidingLi>
        </ul>
      </div>
      <div className="formFooter">
      {
        (!status.address)?
        <button onClick={errorbtn} className ='FormControlBtn right disabled'>Next <i className="fas fa-arrow-right"></i></button>
        :
        <button onClick={nextpage} className ='FormControlBtn right' disabled = {!status.address}>Next <i className="fas fa-arrow-right"></i></button>
      }
        <button onClick={back} className ="FormControlBtn left"><i className="fas fa-arrow-left"></i> Previous</button>
      </div>
    </div>
  )
}
