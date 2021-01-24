import React,{useState,useEffect,useContext,useCallback} from 'react'
import {DeviceStatusContext} from '../../../context/DeviceStatusContext'
import {ifClass} from '../../../myClass.js'

export const IfBlock = ({deviceId,updata,index,el,deleteEl})=>{
  const [status, setStatus]=useState(["power"])
  const [device, setDevice]=useState({})
  const {devices} = useContext(DeviceStatusContext)
  const [result, setResult]=useState(el||new ifClass("0","","==","4"))

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
    updata(el2,index)
  }

  const devEl = ()=>{
    deleteEl(index)
  }

  const statusDevice = useCallback(async ()=>{
    if(!device||!device.DeviceType)return;
    if(device.DeviceType==="light"){
      await changeResult("property","power")
      let mas = ["power"];
      if(device.DeviceConfig.dimmer)
        mas.push("dimmer")
      if(device.DeviceConfig.color)
        mas.push("color")
      if(device.DeviceConfig.mode)
        mas.push("mode")
      setStatus(mas)
    }
    if(device.DeviceType==="dimmer"){
      await changeResult("property","dimmer")
      let mas = ["dimmer"];
      if(device.DeviceConfig.power){
        mas.push("power")
      }
      // else{
      //   if(result.propert==="power")
      //     changeResult("property","dimmer")
      // }
      setStatus(mas)
    }
    if(device.DeviceType==="switch"){
      await changeResult("property","power")
      let mas = ["power"];
      setStatus(mas)
    }
    if(device.DeviceType==="binarySensor"){
      // if(result.propert==="power")
        changeResult("property","value")
      setStatus(["value","battery"])
    }
    if(device.DeviceType==="sensor"){
      // if(result.propert==="power")
       changeResult("property","value")
      setStatus(["value","battery"])
    }
    if(device.DeviceType==="variable"){
      // if(result.propert==="power")
       changeResult("property","value")
      setStatus(["value"])
    }
  },[changeResult,device])

  useEffect(()=>{
    setDevice(lookForDeviceById(result.DeviseId))
  },[deviceId,lookForDeviceById,result])

  useEffect(()=>{
    statusDevice()
  },[device,statusDevice])

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
      <div className="operBlock">
        <select value={result.oper} name="oper" onChange={changeHandler}>
          <option value={"=="}>{"=="}</option>
          <option value={"!="}>!=</option>
          {
            (result.property!=="power"&&device&&device.DeviceType!=="binarySensor")?
            <>
              <option value={">="}>{">="}</option>
              <option value={"<="}>{"<="}</option>
              <option value={">"}>{">"}</option>
              <option value={"<"}>{"<"}</option>
            </>
            :null
          }
        </select>
      </div>
      <div className="valueBlock">
        <div className="typeBlock">
        {
          (result.property==="power")?
          "status: ":"value: "
        }
        </div>
        <div className="inputValueBlock">
        {
          (result.property==="power")?
          <select value={result.value} name="value" onChange={changeHandler}>
            <option value={"1"}>On</option>
            <option value={"0"}>Off</option>
          </select>:
          (result.oper==="=="||result.oper==="!=")?
          <input type="text" value={result.value} name="value" onChange={changeHandler}/>:
          <input type="number" value={Number(result.value)} name="value" onChange={changeHandler}/>
        }
        </div>
      </div>
      {
        (el)?
        <div className="deleteBlock" onClick={devEl}>
          <i className="fas fa-trash"></i>
        </div>:
        null
      }
    </div>
  )
}
