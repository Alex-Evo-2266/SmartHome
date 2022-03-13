import React, {useState,useEffect} from 'react'

const foo = (systemName, type, v)=>{}

export const Enum = ({updata,title,type,conf,value,systemName, outValue=foo}) =>{
  const [newvalue, setValue]=useState(0)

  useEffect(()=>{
    setValue(value)
  },[value])

  const changeHandler = event =>{
    setValue(event.target.value)
    outValue(systemName, type, event.target.value)
  }

  const valuesDecod = (data)=>{
    let newstr = data.split(" ").join("")
    let arr1 = newstr.split(",")
    return arr1
  }

  return(
    <li className="DeviceControlLi">
      <div className="DeviceControlLiName">
        <p>{title||type}</p>
      </div>
      <div className="DeviceControlLiContent">
        <div className="DeviceLiControl">
          <select value={newvalue} onChange={changeHandler}>
          {
            valuesDecod(conf).map((item,index)=>{
              return(
                <option key={index} value={item}>{item}</option>
              )
            })
          }
          </select>
        </div>
      </div>
    </li>
  )
}
