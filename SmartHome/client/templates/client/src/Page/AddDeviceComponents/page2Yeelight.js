import React,{useContext,useState,useEffect,useCallback} from 'react'
import {TypeDeviceContext} from '../../components/typeDevices/typeDevicesContext.js'
import {useHttp} from '../../hooks/http.hook'
import {useChecked} from '../../hooks/checked.hook'
import {useMessage} from '../../hooks/message.hook'

export const AddDevicesPage2Yeelight = ({form, setForm, next, backPage}) => {
  const {message} = useMessage();
  const {type} = useContext(TypeDeviceContext)

  const updata = (key, value)=>{
    setForm({...form, [key]:value})
  }

  const nextPage = ()=>{
    if(!form.DeviceAddress){
      message("нет адреса","error")
      return false
    }
    next()
  }

  return(
    <div className="allFon">
    <div className="configElement">
      <div className="input-data">
        <input onChange={(e)=>updata(e.target.name, e.target.value)} required name="DeviceAddress" type="text" value={form.DeviceAddress}></input>
        <label>Address</label>
      </div>
    </div>
      <div className="buttons">
        <button style={{marginLeft:"10px"}} className="normalSelection button" onClick={backPage}>Back</button>
        <button style={{marginLeft:"10px"}} className="highSelection button" onClick={nextPage}>Next</button>
      </div>
    </div>
  )
}
