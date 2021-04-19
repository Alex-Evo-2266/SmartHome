import React, {useContext,useState,useEffect} from 'react'
import {ScriptContext} from '../../../../context/ScriptContext'
// import {AuthContext} from '../../../../context/AuthContext.js'
import {InputNumber} from '../../../moduls/inputNumber'

export const AddScript = ({add})=>{
  const {scripts} = useContext(ScriptContext)
  const [script, setScript] = useState({});
  const [deviceConfig, setDeviceConfig] = useState({})
  // const auth = useContext(AuthContext)
  const [buttonForm, setButtonForm] = useState({
    id:null,
    name:"",
    type:"script",
    typeAction:"",
    order:0,
    deviceId:null,
    action:"",
    width:1
  })

  const out = (item)=>{
    add({
      id:null,
      name:item.name,
      type:"script",
      typeAction:"",
      order:0,
      deviceId:item.id,
      action:"",
      width:1
    })
  }

  return (
    <ul>
    {
      (!script||!script.id)?
        scripts.map((item,index)=>{
          return(
            <li key={index} onClick={()=>out(item)}><span>{index+1}</span>{item.name}</li>
          )
        }):
        null
    }
    </ul>
  )
}
