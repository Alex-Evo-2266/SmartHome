import React, {useState} from 'react'
import {HidingLi} from '../../../hidingLi.js'

export const BinarySensorMqttConf = ({next,back})=>{

  const [statusConf, setStatusConf] = useState({
    type:"status",
    address:'',
  });

  const nextpage = ()=>{
    next([statusConf])
  }

  const changeHandler = event => {
    setStatusConf({ ...statusConf, [event.target.name]: event.target.value })
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
            <input className = "textInput" placeholder="topic status" id="status" type="text" name="address" value={statusConf.address} onChange={changeHandler} required/>
          </label>
          </HidingLi>
        </ul>
      </div>
      <div className="formFooter">
      {
        (!statusConf.address)?
        <button onClick={errorbtn} className ='FormControlBtn right disabled'>Next <i className="fas fa-arrow-right"></i></button>
        :
        <button onClick={nextpage} className ='FormControlBtn right' disabled = {!statusConf.address}>Next <i className="fas fa-arrow-right"></i></button>
      }
        <button onClick={back} className ="FormControlBtn left"><i className="fas fa-arrow-left"></i> Previous</button>
      </div>
    </div>
  )
}
