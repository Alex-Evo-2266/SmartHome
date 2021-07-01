import React, {useContext} from 'react'
import {ScriptContext} from '../../../../context/ScriptContext'

export const AddScript = ({add})=>{
  const {scripts} = useContext(ScriptContext)

  // const [buttonForm, setButtonForm] = useState({
  //   id:null,
  //   name:"",
  //   type:"script",
  //   typeAction:"",
  //   order:"0",
  //   deviceId:null,
  //   action:"",
  //   width:1,
  //   height:1
  // })

  const out = (item)=>{
    add({
      id:null,
      name:item.name,
      type:"script",
      typeAction:"",
      order:0,
      deviceId:item.id,
      action:"",
      width:1,
      height:1
    })
  }

  return (
    <ul>
    {
        scripts.map((item,index)=>{
          return(
            <li key={index} onClick={()=>out(item)}><span>{index+1}</span>{item.name}</li>
          )
        })
    }
    </ul>
  )
}
