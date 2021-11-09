import React from 'react'
import {useChecked} from '../../hooks/checked.hook'
import {useMessage} from '../../hooks/message.hook'

export const AddDevicesPage3 = ({form, setForm, next, backPage}) => {
  const {USText} = useChecked()
  const {message} = useMessage();

  const updata = (key, value)=>{
    setForm({...form, [key]:value})
  }

  const nextPage = ()=>{
    if(!form.DeviceName || !USText(form.DeviceSystemName)){
      message("некоректные данные","error")
      return
    }
    next()
  }

  return(
    <div className="allFon">
    <div className="configElement">
      <div className="input-data">
        <input onChange={(e)=>updata(e.target.name, e.target.value)} required name="DeviceName" type="text" value={form.DeviceName}></input>
        <label>Name</label>
      </div>
    </div>
    <div className="configElement">
      <div className="input-data">
        <input onChange={(e)=>updata(e.target.name, e.target.value)} required name="DeviceSystemName" type="text" value={form.DeviceSystemName}></input>
        <label>System name</label>
      </div>
    </div>
      <div className="buttons">
        <button style={{marginLeft:"10px"}} className="normalSelection button" onClick={backPage}>Back</button>
        <button style={{marginLeft:"10px"}} className="highSelection button" onClick={nextPage}>Next</button>
      </div>
    </div>
  )
}
