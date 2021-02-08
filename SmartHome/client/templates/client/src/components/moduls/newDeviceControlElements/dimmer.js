import React, {useState} from 'react'

export const Dimmer = ({title,type,conf,value}) =>{
  const [newvalue, setValue]=useState(value)

  const changeHandler = event =>{
    setValue(event.target.value)
  }

  return(
    <li className="DeviceControlLi">
      <div className="DeviceControlLiName">
        <p>{title}</p>
      </div>
      <div className="DeviceControlLiValue">
        <p>{newvalue}</p>
      </div>
      <div className="DeviceLiControl">
      {
        (type==="dimmer")?
        <input type="range" value={newvalue||0} min={conf.min} max={conf.max} onChange={changeHandler}/>:
        (type==="temp")?
        <input type="range" value={newvalue||0} min={conf.min} max={conf.max} onChange={changeHandler}/>:
        null
      }
      </div>
    </li>
  )
}
