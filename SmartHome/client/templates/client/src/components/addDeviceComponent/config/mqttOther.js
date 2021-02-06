import React, {useState} from 'react'

export const OtherMqtt = ({onChange,back})=>{

  const [form, setForm] = useState({
    type:"command",
    address:'',
  });

  const [status, setStatus] = useState({
    type:"status",
    address:""
  })

  const nextpage = (param)=>{
    let arr = []
    for (var item of param) {
      if(item.address)
        arr.push(item)
    }
    onChange(arr)
  }

  const changeHandler = event => {
    setForm({ ...form, [event.target.name]: event.target.value })
    nextpage([{ ...form, [event.target.name]: event.target.value },status])
  }
  const changeHandlerStatus = event => {
    setStatus({ ...status, [event.target.name]: event.target.value })
    nextpage([{ ...status, [event.target.name]: event.target.value },form])
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
