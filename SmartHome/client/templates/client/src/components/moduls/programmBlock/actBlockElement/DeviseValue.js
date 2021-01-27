import React,{useState,useEffect,useCallback} from 'react'

export const DeviceValue = ({device,disabled,deleteEl,updata,data})=>{
  const [status, setStatus]=useState(["power"])
  const [result, setResult]=useState({
    DeviceId:(device&&device.DeviceId)?device.DeviceId:"0",
    property:""
  })

  const changeResult=useCallback((key,value)=>{
    let el2 = result
    el2[key]=value
    setResult(el2)
    if(data&&data.value&&data.value.property!==el2.property&&typeof(updata)==="function"){
      updata(el2)
    }
    return el2;
  },[result,data,updata])

  const changeHandler=(event)=>{
    let el2 = changeResult(event.target.name,event.target.value)
    updata(el2)
  }

  const deleteElement= ()=>{
    if(typeof(deleteEl)==="function")
      deleteEl()
  }


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
  },[changeResult,device])

  return(
    <div className="actBlock">
      <div className="deviceBlock">
        <div className="nameBlock">
          {(device)?device.DeviceName:"Name"}
        </div>
        <div className="stateBlock">
          <select value={result.property} disabled={disabled} onChange={changeHandler} name="property">
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
      {
        (!disabled)?
        <div className="deleteBlock" onClick={()=>{deleteElement()}}>
          <i className="fas fa-trash"></i>
        </div>
        :null
      }
    </div>
  )
}
