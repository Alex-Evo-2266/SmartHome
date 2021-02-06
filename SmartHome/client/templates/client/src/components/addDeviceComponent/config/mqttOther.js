import React, {useState,useEffect} from 'react'
import {HidingLi} from '../../hidingLi.js'

export const OtherMqtt = ({onChange,back})=>{

  const [form, setForm] = useState({
    type:"command",
    address:'',
  });

  const [status, setStatus] = useState({
    type:"status",
    address:""
  })

  const nextpage = ()=>{
    let arr = []
    if(form.address)
      arr.push(form)
    if(status.address)
      arr.push(status)
    onChange(arr)
  }

  useEffect(()=>{
    nextpage()
  },[form,status])

  const changeHandler = event => {
    setForm({ ...form, [event.target.name]: event.target.value })
  }
  const changeHandlerStatus = event => {
    setStatus({ ...status, [event.target.name]: event.target.value })
  }

  const errorbtn = ()=>{
    let input = document.getElementById("command");
    input.style.background="red"
    input.style.boxShadow="inset 0 0 10px #000"
  }

  return(
      <div className = "config">
        <ul>
          <li>
            <label>
              <h5>Enter the topic by status</h5>
              <input className = "textInput" placeholder="topic status" id="status" type="text" name="address" value={status.address} onChange={changeHandlerStatus} required/>
            </label>
          </li>
          <li>
          <label>
            <h5>Enter the topic by command</h5>
            <input className = "textInput" placeholder="topic command" id="command" type="text" name="address" value={form.address} onChange={changeHandler} required/>
          </label>
          </li>
        </ul>
      </div>
  )
}
