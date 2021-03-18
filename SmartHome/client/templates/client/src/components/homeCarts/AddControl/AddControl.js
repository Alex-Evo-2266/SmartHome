import React, {useContext,useState} from 'react'
import {AddControlContext} from './AddControlContext'
import {BackForm} from '../../moduls/backForm'
import {AddButton} from './Control/addButton'

export const AddControl = ()=>{
  const {addControl, hide} = useContext(AddControlContext)
  const [typeChild, setTypeChild] = useState("");

  const close = ()=>{
    hide()
    setTypeChild("")
  }

  const addButton = (t)=>{
    if(addControl.OK){
      addControl.OK(t)
    }
    close()
  }

  if(!addControl.visible){
    return null;
  }

  if(addControl.type === "AddButton"){
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
            </ul>:
            (typeChild==="button")?
            <AddButton add={addButton}/>
            :null
          }
        </div>
      </BackForm>
    )
  }
}
