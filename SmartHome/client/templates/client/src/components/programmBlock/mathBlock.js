import React,{useState,useContext} from 'react'
import {AddScriptContext} from '../addScript/addScriptContext'
import {ValueDeviceBlock} from './valueDeviceBlock'
import {TextBlock} from './textBlock'
import {NumberBlock} from './numberBlock'

export const MathBlock = ({data,updata,block,deleteEl})=>{
  const [type,setType] = useState(data.action??"+")
  const {showData} = useContext(AddScriptContext)


  const changeSelector = event=>{
    let element = data
    setType(event.target.value)
    element={...element,action:event.target.value}
    updata(element)
  }

  const addvalue = (v)=>{
    showData("addValue",{type:"number"},(typeValue,deviceData)=>{
      let element = data
      if(typeValue==="deviceBlock")
        element = {...element, [v]:{type:"device",systemName:deviceData.systemName,action:deviceData.config[0].name}}
      if(typeValue==="Text")
        element = {...element, [v]:{type:"text",value:""}}
      if(typeValue==="Number")
        element = {...element, [v]:{type:"number",value:0}}
      if(typeValue==="Math")
        element = {...element, [v]:{type:"math",value1:null,value2:null,action:"+"}}
      updata(element)
    })
  }

  const updataValue = (data1,v)=>{
    let element = data
    let val = element[v]
    if(data[v].type==="device")
      val = {...val, action:data1.action}
    if(data[v].type==="text")
      val = {...val, value:data1.action}
    if(data[v].type==="number")
      val = {...val, value:data1.action}
    if(data[v].type==="enum")
      val = {...val, value:data1.action}
    if(data[v].type==="math")
      val = data1
    element[v] = val
    updata(element)
  }

  const deleteValue = (v)=>{
    let element = {...data, [v]:null}
    updata(element)
  }

  return(
    <div className="programm-function-block-root">
      <div className="programm-function-block-conteiner-item">
      {
        (!data.value1)?
        <div className="programm-function-block-content-item add" onClick={()=>{addvalue("value1")}}>
          <i className="fas fa-plus"></i>
        </div>:
        (data.value1.type==="device")?
        <ValueDeviceBlock data={data.value1} type="number" updata={(d)=>updataValue(d,"value1")} deleteEl={()=>deleteValue("value1")}/>:
        (data.value1.type==="text")?
        <TextBlock data={data.value1} updata={(d)=>updataValue(d,"value1")} deleteEl={()=>deleteValue("value1")}/>:
        (data.value1.type==="number")?
        <NumberBlock data={data.value1} updata={(d)=>updataValue(d,"value1")} deleteEl={()=>deleteValue("value1")}/>:
        (data.value1.type==="math")?
        <MathBlock data={data.value1} updata={(d)=>updataValue(d,"value1")} deleteEl={()=>deleteValue("value1")}/>:
        null
      }
      </div>
      <div className="programm-function-block-content-item">
        <select value={type} onChange={changeSelector} name="property">
          <option value="+">+</option>
          <option value="-">-</option>
          <option value="*">*</option>
          <option value="/">/</option>
        </select>
      </div>
      <div className="programm-function-block-conteiner-item">
      {
        (!data.value2)?
        <div className="programm-function-block-content-item add" onClick={()=>{addvalue("value2")}}>
          <i className="fas fa-plus"></i>
        </div>:
        (data.value2.type==="device")?
        <ValueDeviceBlock data={data.value2} type="number" updata={(d)=>updataValue(d,"value2")} deleteEl={()=>deleteValue("value2")}/>:
        (data.value2.type==="text")?
        <TextBlock data={data.value2} updata={(d)=>updataValue(d,"value2")} deleteEl={()=>deleteValue("value2")}/>:
        (data.value2.type==="number")?
        <NumberBlock data={data.value2} updata={(d)=>updataValue(d,"value2")} deleteEl={()=>deleteValue("value2")}/>:
        (data.value2.type==="math")?
        <MathBlock data={data.value2} updata={(d)=>updataValue(d,"value2")} deleteEl={()=>deleteValue("value2")}/>:
        null
      }
      </div>
      <div className="programm-function-block-content-item delete" onClick={()=>{deleteEl()}}>
        <i className="fas fa-trash"></i>
      </div>
    </div>
  )
}
