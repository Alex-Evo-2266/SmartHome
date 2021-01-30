import React, {useState} from 'react'
import {HidingLi} from '../../../hidingLi.js'

export const IRMqttConf = ({next,back})=>{

  const [form, setForm] = useState({
    type:"command",
    address:'',
  });

  const nextpage = ()=>{
    next([form])
  }

  const changeHandler = event => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  const errorbtn = ()=>{
    let input = document.getElementById("command");
    input.style.background="red"
    input.style.boxShadow="inset 0 0 10px #000"
  }

  return(
    <div className = "pageForm hide">
      <div className = "formContent moreInput">
        <ul>
          <HidingLi title = "IR config" show = {true}>
          <label>
            <h5>Enter the topic by command</h5>
            <input className = "textInput" placeholder="topic command" id="command" type="text" name="address" value={form.address} onChange={changeHandler} required/>
          </label>
          </HidingLi>
        </ul>
      </div>
      <div className="formFooter">
      {
        (!form.address)?
        <button onClick={errorbtn} className ='FormControlBtn right disabled'>Next <i className="fas fa-arrow-right"></i></button>
        :
        <button onClick={nextpage} className ='FormControlBtn right' disabled = {!form.address}>Next <i className="fas fa-arrow-right"></i></button>
      }
        <button onClick={back} className ="FormControlBtn left"><i className="fas fa-arrow-left"></i> Previous</button>
      </div>
    </div>
  )
}
