import React, {useState,useEffect,useContext} from 'react'
import {HidingLi} from '../../../hidingLi.js'
import {useHttp} from '../../../../hooks/http.hook'
import {useMessage} from '../../../../hooks/message.hook'
import {AuthContext} from '../../../../context/AuthContext.js'
import {useChecked} from '../../../../hooks/checked.hook'


export const SensorMqttEdit = ({deviceData,hide,type="edit"})=>{
  const auth = useContext(AuthContext)
  const {USText} = useChecked()
  const {message} = useMessage();
  const {request, error, clearError} = useHttp();

  useEffect(()=>{
    message(error,"error")
    return ()=>{
      clearError();
    }
  },[error,message, clearError])
  const [field, setField] = useState(deviceData.DeviceConfig||[]);
  const [count, setCount] = useState(deviceData.DeviceConfig.length);

  const [device, setDevice] = useState({
    DeviceId:deviceData.DeviceId||0,
    DeviceInformation:deviceData.DeviceInformation||"",
    DeviceSystemName:deviceData.DeviceSystemName||"",
    DeviceName:deviceData.DeviceName||"",
    DeviceType:deviceData.DeviceType||"sensor",
    DeviceValueType:deviceData.DeviceValueType||"json",
    DeviceAddress:deviceData.DeviceAddress||"",
    DeviceTypeConnect:deviceData.DeviceTypeConnect||"mqtt",
    RoomId:deviceData.RoomId,
  })

  const changeHandler = event => {
    setDevice({ ...device, [event.target.name]: event.target.value })
  }
  const changeHandlerField = event => {
    let index = event.target.dataset.id
    console.log(index);
    let arr = field.slice()
    let newData = { ...arr[index], [event.target.name]: event.target.value }
    arr[index] = newData
    setField(arr)
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
    if(!field||!field[0]){return false}
    for (var item of field) {
      if(!item||!item.type||!item.address){return false}
    }
    return true
  }
  const outHandler = async ()=>{
    if(!valid()){
      return message("не все поля заполнены","error")
    }
    let conf = field
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

  const addField = ()=>{
    let arr = field.slice()
    arr.push({
      address:"c"+count,
      type:"c"+count,
      icon:"",
      typeControl:"sensor"
    })
    setCount((prev)=>prev+1)
    setField(arr)
  }
  const deleteField = (index)=>{
    let arr = field.slice()
    arr = arr.filter((it,index2)=>index!==index2)
    setCount((prev)=>prev-1)
    setField(arr)
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
        field.map((item,index)=>{
          return(
            <HidingLi title = "Field" show = {true} key={index}>
            <label>
              <h5>Enter the type</h5>
              <input data-id={index} className = "textInput" placeholder="type" type="text" name="type" value={item.type} onChange={changeHandlerField} required/>
            </label>
            <label>
              <h5>Enter the address</h5>
              <input data-id={index} className = "textInput" placeholder="address" type="text" name="address" value={item.address} onChange={changeHandlerField} required/>
            </label>
            <label>
              <h5>Enter the unit</h5>
              <input data-id={index} className = "textInput" placeholder="unit" type="text" name="icon" value={item.icon} onChange={changeHandlerField} required/>
            </label>
            <button onClick={()=>deleteField(index)}>delete</button>
            </HidingLi>
          )
        })
      }
      <button onClick={addField}>add</button>
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
