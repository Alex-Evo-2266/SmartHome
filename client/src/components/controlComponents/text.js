import React, {useState} from 'react'

const foo = (systemName, type, v)=>{}

export const Text = ({updata,title,type,conf,value,systemName,outValue=foo}) =>{
  const [newvalue, setValue]=useState(value)

  const changeHandler = event =>{
    setValue(event.target.value)
  }

  const out = ()=>{
    outValue(systemName, type, newvalue)
  }

  return(
    <li className="DeviceControlLi">
      <div className="DeviceControlLiName">
        <p>{title||"text"}</p>
      </div>
      <div className="DeviceControlLiContent">
        <div className="DeviceLiControl" style={{display: "flex",justifyContent: "flex-end"}}>
          <input type="text" onFocus={()=>{}} value={newvalue} onChange={changeHandler}/>
          <input type="button" onClick={out} value="send"/>
        </div>
      </div>
    </li>
  )
}
