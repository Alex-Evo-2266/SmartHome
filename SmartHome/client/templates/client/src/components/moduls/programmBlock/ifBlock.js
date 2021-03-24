import React,{useState,useEffect,useContext,useCallback} from 'react'
import {DeviceStatusContext} from '../../../context/DeviceStatusContext'
// import {ifClass} from '../../../myClass.js'

export const IfBlock = ({deviceId,updata,index,el,deleteEl})=>{
  const [status, setStatus]=useState(["power"])
  const [device, setDevice]=useState({})
  const {devices} = useContext(DeviceStatusContext)
  const [result, setResult]=useState(el||{type:"",DeviseId:"0",property:"",oper:"==",value:"4"})

const changeHandler=()=>{

}

const devEl=()=>{

}

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
