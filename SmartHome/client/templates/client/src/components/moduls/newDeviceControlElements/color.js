import React, {useState} from 'react'

export const Color = ({title,type,conf,value}) =>{
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
        (type==="power")?
        <input type="button" value={(newvalue===1)?"off":"no"}/>:
        (type==="dimmer")?
        <input type="range" min={conf.min} max={conf.max} onChange={changeHandler}/>:
        (type==="temp")?
        <input type="range" min={conf.min} max={conf.max} onChange={changeHandler}/>:
        (type==="color")?
        <p>404</p>:
        (type==="mode")?
        <input type="button"/>:
        null
      }

      </div>
    </li>
  )
}
