import React, {useContext, useState} from 'react'
import {Switch} from '../../switch'

export const Device = ({device, onClick, setGroupDevice, groupDevice, added=false, field=false})=>{
  const [visible, setVisible] = useState(false)
  const [newvalue] = useState(false)

  const togle = (event)=>{
    if(event.target.className.split(" ")[0]!=="hidingLi"&&event.target.parentNode.className.split(" ")[0]!=="hidingLi") return;
    setVisible(!visible)
  }

  const clickHandler = (val, name, type)=>{
    let arr = groupDevice.fields.slice();
    if (!val)
      arr = arr.filter((item)=>item.name !== name)
    if (val)
      arr.push({name, type})
    setGroupDevice({...groupDevice, fields:arr})
  }

  const isField = namef => groupDevice.fields.filter(item => item.name === namef).length !== 0

  return(
    <li name = "HidingLi" className={`hidingLi ${(visible)?"show":"hide"}`}>
      <h3 value = "HidingLi" className="LiTitle">{device?.name} {device?.systemName}</h3>
      {
        (field)?
        <i value = "HidingLi" className="iconOpenField fas fa-chevron-down" onClick={togle}></i>
        :null
      }
      <i value = "HidingLi" className={`iconAdded ${(added)?"added":""} fas fa-plus`} onClick={onClick}></i>
      {
        (field)?
        <div className="LiContent">
          {
            device?.config?.map((item, index)=>{
              return(
                <div className="devEl" key={index}>
                <p>{item.name}</p>
                <Switch onClick={(v)=>clickHandler(v, item.name, item.type)} value={isField(item.name)}/>
                </div>
              )
            })
          }
        </div>
        :null
      }
    </li>
  )
}
