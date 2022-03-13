import React, {useState} from 'react'

const foo = (v) => {}

export const Switch = ({value, onClick = foo}) =>{
  const [newvalue, setValue]=useState(value||false)

  const clickHandler = event =>{
    setValue(event.target.checked)
    onClick(event.target.checked)
  }

  return(
    <div className="switchContainer">
    <label className="switch">
      <input onChange={clickHandler} name="auteStyle" type="checkbox" checked={newvalue}></input>
      <span></span>
      <i className="indicator"></i>
    </label>
    </div>
  )
}
