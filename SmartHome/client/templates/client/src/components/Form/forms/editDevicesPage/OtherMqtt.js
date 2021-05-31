import React, {useState,useEffect,useContext} from 'react'
import {HidingLi} from '../../../hidingLi.js'
import {useHttp} from '../../../../hooks/http.hook'
import {useMessage} from '../../../../hooks/message.hook'
import {AuthContext} from '../../../../context/AuthContext.js'
import {useChecked} from '../../../../hooks/checked.hook'

export const OtherMqttEdit = ({deviceData,hide,type="edit"})=>{
  const auth = useContext(AuthContext)
  const {message} = useMessage();
  const {USText} = useChecked()
  const {request, error, clearError} = useHttp();

  useEffect(()=>{
    message(error,"error")
    return ()=>{
      clearError();
    }
  },[error,message, clearError])

  const [device, setDevice] = useState({
    DeviceId:deviceData.DeviceId||0,
    DeviceInformation:deviceData.DeviceInformation||"",
    DeviceName:deviceData.DeviceName||"",
    DeviceSystemName:deviceData.DeviceSystemName||"",
    DeviceType:deviceData.DeviceType||"other",
    DeviceValueType:deviceData.DeviceValueType||"json",
    DeviceAddress:deviceData.DeviceAddress||"",
    DeviceTypeConnect:deviceData.DeviceTypeConnect||"mqtt",
    RoomId:deviceData.RoomId,
  })
  const [command, setCommand] = useState(deviceData.DeviceConfig||[]);
  const [count, setCount] = useState(deviceData.DeviceConfig.length);

  const changeHandler = event => {
    setDevice({ ...device, [event.target.name]: event.target.value })
  }
  const changeHandlerField = event => {
    let index = event.target.dataset.id
    let arr = command.slice()
    let newcom = { ...arr[index], [event.target.name]: event.target.value }
    arr[index] = newcom
    setCommand(arr)
  }
const changeHandlerTest = event=>{
  if(USText(event.target.value)){
    changeHandler(event)
    return ;
  }
  message("forbidden symbols","error")
}

  function valid() {
    if(
      !device.DeviceSystemName||
      !device.DeviceValueType||
      !device.DeviceAddress||
      !device.DeviceName||
      !device.DeviceType||
      !device.DeviceTypeConnect
    ){return false}
    if(!command||!command[0]){return false}
    for (var item of command) {
      if(!item||!item.type||!item.address){return false}
    }
    return true
  }
  const outHandler = async ()=>{
    if(!valid()){
      return message("не все поля заполнены","error")
    }
    let conf = command
    let dataout = {
      ...device,
      config:conf
    }
    if(type==="edit")
      await request(`/api/devices`, 'PUT', {...dataout},{Authorization: `Bearer ${auth.token}`})
    else if(type==="link")
      await request('/api/devices', 'POST', {...dataout},{Authorization: `Bearer ${auth.token}`})
    hide();
  }

  const deleteHandler = async () =>{
    message("All dependent scripts and controls will be removed along with the device. Delete?","dialog",async()=>{
      await request(`/api/devices/${device.DeviceId}`, 'DELETE', null,{Authorization: `Bearer ${auth.token}`})
      hide();
    },"no")
  }

  const addcom = ()=>{
    let arr = command.slice()
    arr.push({
      address:"c"+count,
      type:"c"+count,
      typeControl: "text",
      low:"0",
      high:"100"
    })
    setCount((prev)=>prev+1)
    setCommand(arr)
  }

  const delcom = (index)=>{
    let arr = command.slice()
    arr = arr.filter((it,index2)=>index!==index2)
    arr = arr.map((item,i)=>{
      return {...item,type:"c"+i}
    })
    setCount((prev)=>prev-1)
    setCommand(arr)
  }

  return (
    <ul className="editDevice">
      <li>
        <label>
          <h5>{`Type - ${device.DeviceType}`}</h5>
          <h5>{`Type connect - ${device.DeviceTypeConnect}`}</h5>
        </label>
      </li>
      <li>
        <label>
          <h5>Name</h5>
          <input className = "textInput" placeholder="name" id="DeviceName" type="text" name="DeviceName" value={device.DeviceName} onChange={changeHandler} required/>
        </label>
      </li>
      <li>
        <label>
          <h5>System name</h5>
          <input className = "textInput" placeholder="system name" id="DeviceSystemName" type="text" name="DeviceSystemName" value={device.DeviceSystemName} onChange={changeHandlerTest} required/>
        </label>
      </li>
      <li>
        <label>
          <h5>Address</h5>
          <input className = "textInput" placeholder="address" id="DeviceAddress" type="text" name="DeviceAddress" value={device.DeviceAddress} onChange={changeHandler} required/>
        </label>
      </li>
      <li>
        <label>
          <h5>Type value</h5>
          <select name="DeviceValueType" value={device.DeviceValueType} onChange={changeHandler}>
            <option value="json">json</option>
            <option value="value">value</option>
          </select>
        </label>
      </li>
      <li>
        <label>
          <h5>information</h5>
          <input className = "textInput" placeholder="information" id="DeviceInformation" type="text" name="DeviceInformation" value={device.DeviceInformation} onChange={changeHandler} required/>
        </label>
      </li>
      {
        command.map((item,index)=>{
          return(
            <HidingLi key={index} title = {`IR config ${index}`} show = {true}>
            <label>
              <h5>Enter the type</h5>
              <input data-id={index} className = "textInput" placeholder="type" type="text" name="type" value={item.type} onChange={changeHandlerField} required/>
            </label>
            <label>
              <h5>Enter the address</h5>
              <input data-id={index} className = "textInput" placeholder="address" type="text" name="address" value={item.address} onChange={changeHandlerField} required/>
            </label>
            <label>
              <h5>Type</h5>
              <select data-id={index} name="typeControl" value={item.typeControl} onChange={changeHandlerField}>
                <option value="boolean">boolean</option>
                <option value="text">text</option>
                <option value="number">number</option>
                <option value="range">range</option>
                <option value="sensor">sensor</option>
              </select>
            </label>
            {
              (item.typeControl==="range"||item.typeControl==="boolean")?
              <>
              <label>
                <h5>Enter the min</h5>
                <input data-id={index} className = "textInput" placeholder="min Dimmer" id="minDimmer" type={(item.typeControl==="range")?"number":"text"} name="low" value={item.low} onChange={changeHandlerField} required/>
              </label>
              <label>
                <h5>Enter the max</h5>
                <input data-id={index} className = "textInput" placeholder="max Dimmer" id="maxDimmer" type={(item.typeControl==="range")?"number":"text"} name="high" value={item.high} onChange={changeHandlerField} required/>
              </label>
              </>
              :null
            }
            <button onClick={()=>delcom(index)}>delete</button>
            </HidingLi>
          )
        })
      }
      <li>
        <button onClick={addcom}>add</button>
      </li>
      <div className="controlForm" >
      {
        (type==="edit")?
        <button className="formEditBtn Delete" onClick={deleteHandler}>Delete</button>
        :null
      }
        <button className="formEditBtn" onClick={outHandler}>Save</button>
      </div>
    </ul>
  )

}
