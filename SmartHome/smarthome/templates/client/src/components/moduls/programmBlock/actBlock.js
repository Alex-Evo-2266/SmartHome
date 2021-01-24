import React,{useState,useEffect,useContext,useCallback} from 'react'
import {DeviceStatusContext} from '../../../context/DeviceStatusContext'
import {AddScriptContext} from '../../addScript/addScriptContext'
import {StatusValue} from './actBlockElement/statusValue'
import {DeviceValue} from './actBlockElement/DeviseValue'
import {TextValue} from './actBlockElement/TextValue'
import {valueClass} from '../../../myClass.js'

export const ActBlock = ({deviceId,type,updata,index,el,block,deleteEl})=>{
  const [status, setStatus]=useState(["power"])
  const [device, setDevice]=useState({})
  const {showData} = useContext(AddScriptContext)
  const {devices} = useContext(DeviceStatusContext)
  const [result, setResult]=useState(el)
  const [velueDevice,setValueDevice]=useState({})


  const lookForDeviceById = useCallback((id)=>{
    let condidat = devices.filter((item)=>item.DeviceId===id)
    return condidat[0];
  },[devices])

  const changeResult = useCallback((key,value)=>{
    if(typeof(result.changeHandler)!=="function")
      return
    let el2 = result
    el2.changeHandler(key,value)
    setResult(el2)
    return el2
  },[result])

  const changeHandler = async event => {
    let el2 = await changeResult(event.target.name,event.target.value)
    updata(el2,index,block)
  }

  const updataValue = (value)=>{
    let el2 = result
    el2.value.value = value
    setResult(el2)
    updata(el2,index,block)
  }

  const addStatus = ()=>{
    showData("statusBlock",{DeviceType:device.DeviceType},(type,deviceitem1)=>{
      let el2 = result
      let value1 = new valueClass(type)
      if(deviceitem1&&type==="DeviseValue"){
        setValueDevice(deviceitem1)
        value1.value = {DeviceId:deviceitem1.DeviceId,property:"power"}
      }
      el2.changeHandler("value",value1)
      setResult(el2)
      updata(el2,index,block)
    })
  }

  const deletStatus = ()=>{
    let el2 = result
    el2.changeHandler("value",null)
    setResult(el2)
    updata(el2,index,block)
  }

  useEffect(()=>{
    setDevice(lookForDeviceById(result.DeviseId))
  },[lookForDeviceById,result])

  useEffect(()=>{
    if(!device)return;
    if(device.DeviceType==="light"){
      changeResult("property","power")
      let mas = ["power"];
      if(device.DeviceConfig.dimmer)
        mas.push("dimmer")
      if(device.DeviceConfig.color)
        mas.push("color")
      if(device.DeviceConfig.mode)
        mas.push("mode","togleMode")
      setStatus(mas)
    }
    if(device.DeviceType==="dimmer"){
      changeResult("property","dimmer")
      let mas = ["dimmer"];
      if(device.DeviceConfig.power)
        mas.push("power")
      setStatus(mas)
    }
    if(device.DeviceType==="switch"){
      changeResult("property","power")
      let mas = ["power"];
      setStatus(mas)
    }
    if(device.DeviceType==="ir"){
      changeResult("property","command")
      setStatus(["command"])
    }
    if(device.DeviceType==="variable"){
      // if(result.propert==="power")
       changeResult("property","value")
      setStatus(["value"])
    }
  },[device,changeResult])

  return(
    <div className="actBlock">
      <div className="deviceBlock">
        <div className="nameBlock">
          {(device)?device.DeviceName:"Name"}
        </div>
        <div className="stateBlock">
          <select value={result.property} onChange={changeHandler} name="property">
            {
              status.map((item,index)=>{
                return(
                  <option key={index} value={item}>{item}</option>
                )
              })
            }
          </select>
        </div>
      </div>
      <div className="deleteBlock" onClick={()=>{deleteEl(index,block)}}>
        <i className="fas fa-trash"></i>
      </div>
      {
        (result.property!=="togleMode")?
        (!result.value)?
        <div className="addBlock" onClick={addStatus}>
          <i className="fas fa-plus"></i>
        </div>
        :<div className="addBlock">
          <i>{">"}</i>
        </div>
        :null
      }
      {
        (result.value&&result.value.type==="status")?
          <StatusValue deleteEl={deletStatus} updata={updataValue} data={result.value}/>:
        (result.value&&result.value.type==="DeviseValue")?
          <DeviceValue device={velueDevice} updata={updataValue} deleteEl={deletStatus} data={result.value}/>:
        (result.value&&result.value.type==="value")?
          <TextValue deleteEl={deletStatus} updata={updataValue} data={result.value} number={!(result.property==="power"||result.property==="command"||result.property==="value")}/>:
        null
      }
    </div>
  )
}
// <div className="valueBlock">
//   <div className="typeBlock">
//     {"Set in: "}
//   </div>
//   <div className="inputValueBlock">
//   {
//     (result.property==="power")?
//     <select value={result.value} name="value" onChange={changeHandler}>
//       <option value={"powerOn"}>On</option>
//       <option value={"powerOff"}>Off</option>
//       <option value={"powerTogle"}>Togle</option>
//     </select>:
//     (result.property==="command"||device.DeviceType==="variable")?
//     <input type="text" value={result.value} name="value" onChange={changeHandler}/>:
//     (result.property==="togleMode")?
//     <p> following</p>:
//     <input type="number" value={Number(result.value)} name="value" onChange={changeHandler}/>
//   }
//   </div>
// </div>
