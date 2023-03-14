import React from 'react'
import {useMessage} from '../../hooks/message.hook'

export const AddDevicesPage2Yeelight = ({form, setForm, next, backPage}) => {
  const {message} = useMessage();

  const updata = (key, value)=>{
    setForm({...form, [key]:value})
  }

  const nextPage = ()=>{
    if(!form.address){
      message("нет адреса","error")
      return false
    }
    next()
  }

  return(
    <div className="allFon">
    <div className="infoElement">
      <p>1. Через оригинальное приложение необходимо включить у устройства управление по LAN.</p>
      <p>2. Введите ip адресс устройства (его можно посмотреть в том же приложении).</p>
    </div>
    <div className="configElement">
      <div className="input-data">
        <input onChange={(e)=>updata(e.target.name, e.target.value)} required name="address" type="text" value={form.address}></input>
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
