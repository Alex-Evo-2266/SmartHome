import React, {useState,useEffect, useRef} from 'react'

const foo = (systemName, type, v)=>{}

export const Dimmer = ({updata,title,type,conf,value,systemName,outValue=foo}) =>{
  const [newvalue, setValue]=useState(0)
  const delay = useRef(null)

  useEffect(()=>{
    setValue(value)
  },[value])

  const changeHandler = event =>{
    setValue(event.target.value)
    setTimeout(function () {
      if(typeof(updata)==='function')
        updata()
    }, 500);
    if(delay.current){
      clearTimeout(delay.current)
    }
    delay.current = setTimeout(function () {
      outValue(systemName, type, event.target.value)
    }, 200);
  }

  function isColor(text) {
    return (text.indexOf("color") !== -1)
  }

  return(
    <li className="DeviceControlLi">
      <div className="DeviceControlLiName">
        <p>{title||"level"}</p>
      </div>
      <div className="DeviceControlLiContent">
      <div className="DeviceControlLiValue">
        <p>{newvalue||"0"}</p>
      </div>
      <div className={`DeviceLiControl ${(isColor(type))?"allColor":""}`}>
        <input type="range" value={newvalue||0} min={conf.min} max={conf.max} onChange={changeHandler} onInput={changeHandler}/>
      </div>
      </div>
    </li>
  )
}
