import React, {useContext,useState} from 'react'
import {AddControlContext} from './AddControlContext'
import {BackForm} from '../../moduls/backForm'
import {AddButton} from './Control/addButton'
import {AddSlider} from './Control/addSlider'
import {AddScript} from './Control/addScript'
import {AddSensor} from './Control/addSensor'
import {AddEnum} from './Control/addEnum'
import {AddText} from './Control/addText'

const weather = {
  id:null,
  name:"weather",
  type:"weather",
  typeAction:"",
  order:"0",
  deviceId:null,
  action:"",
  width:1,
  height:1
}

export const AddControl = ()=>{
  const {addControl, hide} = useContext(AddControlContext)
  const [typeChild, setTypeChild] = useState("");

  const close = ()=>{
    hide()
    setTypeChild("")
  }

  const addButton = (t)=>{
    // if(addControl.type === "AddLineButton"){
    //   t.type = 'line-' + t.type
    // }
    if(addControl.OK){
      addControl.OK(t)
    }
    close()
  }

  if(!addControl.visible){
    return null;
  }

  if(addControl.type === "AddButton"||addControl.type === "AddLineButton"){
    return (
      <BackForm onClick = {close} className="addElementBody">
        <div className="box">
          <h2>type control element</h2>
          {
            (!typeChild)?
            <ul>
              <li onClick={()=>setTypeChild("button")}><span>1</span>button activate</li>
              <li onClick={()=>setTypeChild("script")}><span>2</span>scripts</li>
              <li onClick={()=>setTypeChild("slider")}><span>3</span>slider</li>
              <li onClick={()=>setTypeChild("sensor")}><span>4</span>sensor monitor</li>
              <li onClick={()=>setTypeChild("enum")}><span>5</span>enum</li>
              {
                (addControl.type === "AddButton")?
                <li onClick={()=>addButton(weather)}><span>6</span>weather</li>:
                (addControl.type === "AddLineButton")?
                <li onClick={()=>setTypeChild("text")}><span>6</span>text</li>:
                null
              }
            </ul>:
            (typeChild==="button")?
            <AddButton add={addButton}/>:
            (typeChild==="slider")?
            <AddSlider add={addButton}/>:
            (typeChild==="script")?
            <AddScript add={addButton}/>:
            (typeChild==="sensor")?
            <AddSensor add={addButton}/>:
            (typeChild==="enum")?
            <AddEnum add={addButton}/>:
            (typeChild==="text")?
            <AddText add={addButton}/>
            :null
          }
        </div>
      </BackForm>
    )
  }
}
