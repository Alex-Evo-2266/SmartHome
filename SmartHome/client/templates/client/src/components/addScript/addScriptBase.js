import React, {useContext,useState} from 'react'
import {AddScriptContext} from './addScriptContext'
import {AddScriptDevices} from './addScript/addScriptDevices'
import {CenterWindow} from '../modalWindow/centerWindow'
import {BackForm} from '../moduls/backForm'
import {ShowScript} from './addScript/showScript'
import {TypeAct} from './addScript/typeAct'
import {AddScriptsAct} from './addScript/addActScript'


export const AddScriptBase = ()=>{
  const {addScript, hide} = useContext(AddScriptContext)
  const [deviceBlock, setDeviceBlock]=useState(false)

  const close = ()=>{
    hide()
    setDeviceBlock(false)
  }

  const shoseDevice=(item)=>{
    if(typeof(addScript.OK)==="function")
      addScript.OK("deviceBlock",item)
    close()
  }

  const shoseBlock = async(t)=>{
    if(t==="deviceBlock"||t==="DeviceValue"){
      setDeviceBlock(true)
      return
    }
    // await setBlock(t)
    if(typeof(addScript.OK)==="function")
      addScript.OK(t)
    close()
  }

  if(!addScript.visible){
    return null;
  }

  if(addScript.type==="showScript"){
    return (
      <CenterWindow hide={close}>
        <ShowScript data={addScript.data}/>
      </CenterWindow>
    )
  }

  if(addScript.type==="triggerBlock"){
    return (
      <BackForm onClick={close} className="addElementBody">
        <AddScriptDevices result={shoseDevice} type={"if"}/>
      </BackForm>
    )
  }

  if(addScript.type==="typeAct"){
    return (
      <BackForm onClick={close} className="addElementBody">
        <TypeAct result={shoseDevice}/>
      </BackForm>
    )
  }

  if(addScript.type==="deviceBlock"){
    return (
      <BackForm onClick={close} className="addElementBody">
        <AddScriptDevices result={shoseDevice} type={"act"}/>
      </BackForm>
    )
  }

  if(addScript.type==="scriptBlock"){
    return (
      <BackForm onClick={close} className="addElementBody">
        <AddScriptsAct result={shoseDevice} type={"act"}/>
      </BackForm>
    )
  }

  if(addScript.type==="addValue"||addScript.type==="addValueMath"){
    console.log("shose",addScript.data);
    return(
      <BackForm onClick={close} className="addElementBody">
      {
        (!deviceBlock)?
        <div className="box">
          <h2>type value</h2>
          <ul>
          {
            (addScript.type==="addValue"&&addScript.data.type==="text")?
            <li onClick={()=>shoseBlock("Text")}><span>1</span>input text</li>
            :null
          }
          {
            (addScript.data.type==="number" || addScript.type==="addValueMath")?
            <li onClick={()=>shoseBlock("Number")}><span>2</span>input number</li>
            :null
          }
          {
            (addScript.type==="addValueMath" || addScript.data.type==="number")?
            <li onClick={()=>shoseBlock("Math")}><span>3</span>Mathematical expression</li>
            :null
          }
          {
            (addScript.data.type!=="enum")?
            <li onClick={()=>shoseBlock("DeviceValue")}><span>4</span>Device value</li>
            :null
          }
          {
            (addScript.data.type==="enum" || addScript.data.type==="binary")?
            <li onClick={()=>shoseBlock("Enum")}><span>3</span>state value</li>
            :null
          }
          </ul>
        </div>:
        <AddScriptDevices result={shoseDevice} type={"if"} typeDev={addScript.data.type}/>
      }
      </BackForm>
    )
  }

  if(addScript.type==="typeBlock"){
    return (
      <BackForm onClick={close} className="addElementBody">
      {
        (!deviceBlock)?
        <div className="box">
          <h2>type control element</h2>
            <ul>
              <li onClick={()=>shoseBlock("groupBlockAnd")}><span>1</span>group Block And</li>
              <li onClick={()=>shoseBlock("groupBlockOr")}><span>2</span>group Block Or</li>
              <li onClick={()=>shoseBlock("deviceBlock")}><span>3</span>device</li>
            </ul>
          </div>
        :
        <AddScriptDevices result={shoseDevice} type={"if"}/>
      }
      </BackForm>
    )
  }
  return null;
}
