import React,{useState} from 'react'
// import {actClass} from '../../../../myClass.js'

export const StatusValue = ({disabled=false,deleteEl,updata,data})=>{
  const [value,setValue]=useState((data&&data.value)?data.value:"on")

  const changeHandler = async(event)=>{
    await setValue(event.target.value)
    updata(event.target.value)
  }

  const deleteElement= ()=>{
    if(typeof(deleteEl)==="function")
      deleteEl()
  }

  return(
    <div className="valueBlock">
      <div className="typeBlock">
        {"Set in: "}
      </div>
      <div className="inputValueBlock">
        <select value={value} name="value" disabled={disabled} onChange={changeHandler}>
          <option value={"on"}>On</option>
          <option value={"off"}>Off</option>
          <option value={"togle"}>Togle</option>
        </select>
      </div>
      {
        (!disabled)?
        <div className="deleteBlock" onClick={()=>{deleteElement()}}>
          <i className="fas fa-trash"></i>
        </div>
        :null
      }
    </div>
  )
}
