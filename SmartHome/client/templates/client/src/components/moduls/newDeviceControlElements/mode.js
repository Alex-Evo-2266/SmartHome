import React, {useState} from 'react'

export const Mode = ({title,type,conf,value}) =>{
  const [newvalue, setValue]=useState(value)

  const clickHandler = event =>{

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
        <input type="button" value="mode"/>
      </div>
    </li>
  )
}
