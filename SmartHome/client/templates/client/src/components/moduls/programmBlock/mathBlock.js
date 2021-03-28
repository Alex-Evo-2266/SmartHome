import React,{useState,useEffect,useContext,useCallback} from 'react'
import {DeviceStatusContext} from '../../../context/DeviceStatusContext'
import {AddScriptContext} from '../../addScript/addScriptContext'
import {ValueDeviceBlock} from './valueDeviceBlock'
import {TextBlock} from './textBlock'
import {NumberBlock} from './numberBlock'

export const MathBlock = ({data,updata,el,block,deleteEl})=>{
  const [type,setType] = useState(data.action??"+")
  const [blockData/*, setData*/] = useState(data)
  const {show} = useContext(AddScriptContext)


  const changeSelector = event=>{
    let element = data
    setType(event.target.value)
    element={...element,action:event.target.value}
    updata(element)
  }

  const addvalue = (v)=>{
    show("addValueMath",(typeValue,deviceData)=>{
      let element = data
      if(typeValue==="deviceBlock"){
        let action = "power"
        if(deviceData.DeviceType==="dimmer"){
          action = "dimmer"
        }
        if(deviceData.DeviceType==="variable"){
          action = "value"
        }
        if(deviceData.DeviceType==="sensor"||deviceData.DeviceType==="binarySensor"||deviceData.DeviceType==="other"){
          action = "value"
        }
        element = {...element, [v]:{type:"device",idDevice:deviceData.DeviceId,action:action}}
      }
      if(typeValue==="Text"){
        element = {...element, [v]:{type:"text",value:""}}
      }
      if(typeValue==="Number"){
        element = {...element, [v]:{type:"number",value:0}}
      }
      if(typeValue==="Math"){
        element = {...element, [v]:{type:"math",value1:null,value2:null,action:"+"}}
      }
      updata(element)
    })
  }

  const updataValue = (data1,v)=>{
    let element = blockData
    let val = element[v]
    if(val.type==="device"){
      val = {...val, action:data1.action}
    }
    if(val.type==="text"){
      val = {...val, value:data1.action}
    }
    if(val.type==="number"){
      val = {...val, value:data1.action}
    }
    if(val.type==="math"){
      val = data1
    }
    element[v] = val
    updata(element)
  }

  const deleteValue = (v)=>{
    let element = data
    element = {...element, [v]:null}
    updata(element)
  }

  return(
    <div className="programm-function-block-root">
      <div className="programm-function-block-conteiner-item">
      {
        (!blockData.value1)?
        <div className="programm-function-block-content-item add" onClick={()=>{addvalue("value1")}}>
          <i className="fas fa-plus"></i>
        </div>:
        (blockData.value1.type==="device")?
        <ValueDeviceBlock deviceId={blockData.value1.idDevice} action={blockData.value1.action} updata={(d)=>updataValue(d,"value1")} deleteEl={()=>deleteValue("value1")}/>:
        (blockData.value1.type==="text")?
        <TextBlock action={blockData.value1.value} updata={(d)=>updataValue(d,"value1")} deleteEl={()=>deleteValue("value1")}/>:
        (blockData.value1.type==="number")?
        <NumberBlock action={blockData.value1.value} updata={(d)=>updataValue(d,"value1")} deleteEl={()=>deleteValue("value1")}/>:
        (blockData.value1.type==="math")?
        <MathBlock data={blockData.value1} action={blockData.value1.value} updata={(d)=>updataValue(d,"value1")} deleteEl={()=>deleteValue("value1")}/>:
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
        (!blockData.value2)?
        <div className="programm-function-block-content-item add" onClick={()=>{addvalue("value2")}}>
          <i className="fas fa-plus"></i>
        </div>:
        (blockData.value2.type==="device")?
        <ValueDeviceBlock deviceId={blockData.value2.idDevice} action={blockData.value2.action} updata={(d)=>updataValue(d,"value2")} deleteEl={()=>deleteValue("value2")}/>:
        (blockData.value2.type==="text")?
        <TextBlock action={blockData.value2.value} updata={(d)=>updataValue(d,"value2")} deleteEl={()=>deleteValue("value2")}/>:
        (blockData.value2.type==="number")?
        <NumberBlock action={blockData.value2.value} updata={(d)=>updataValue(d,"value2")} deleteEl={()=>deleteValue("value2")}/>:
        (blockData.value2.type==="math")?
        <MathBlock data={blockData.value2} action={blockData.value2.value} updata={(d)=>updataValue(d,"value2")} deleteEl={()=>deleteValue("value2")}/>:
        null
      }
      </div>
      <div className="programm-function-block-content-item delete" onClick={()=>{deleteEl()}}>
        <i className="fas fa-trash"></i>
      </div>
    </div>
  )
}
