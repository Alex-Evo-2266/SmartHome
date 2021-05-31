import React, {useState,useEffect,useContext} from 'react'
import {HidingLi} from '../../../hidingLi.js'
import {useHttp} from '../../../../hooks/http.hook'
import {useMessage} from '../../../../hooks/message.hook'
import {AuthContext} from '../../../../context/AuthContext.js'
import {useChecked} from '../../../../hooks/checked.hook'


export const DimmerMqttEdit = ({deviceData,hide,type="edit"})=>{
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

  const [device, setDevice] = useState({
    DeviceId:deviceData.DeviceId||0,
    DeviceInformation:deviceData.DeviceInformation||"",
    DeviceSystemName:deviceData.DeviceSystemName||"",
    DeviceName:deviceData.DeviceName||"",
    DeviceValueType:deviceData.DeviceValueType||"json",
    DeviceAddress:deviceData.DeviceAddress||"",
    DeviceType:deviceData.DeviceType||"dimmer",
    DeviceTypeConnect:deviceData.DeviceTypeConnect||"mqtt",
    RoomId:deviceData.RoomId,
  })
  const [power, setPower] = useState({
    type:"power",
    address:"",
    low:"",
    high:"",
    icon:"",
    typeControl:"boolean"
  })
  const [dimmer, setDimmer] = useState({
    type:"dimmer",
    address:"",
    low:"",
    high:"",
    icon:"",
    typeControl:"range"
  })

  useEffect(()=>{
    if(!deviceData||!deviceData.DeviceConfig)return
    console.log(deviceData);
    for (var item of deviceData.DeviceConfig) {
      let confel = {
        type:item.type,
        address:item.address,
        low:item.low||"",
        high:item.high||"",
        icon:item.icon||"",
        typeControl:""
      }
      if(item.type==="power"){
        confel.typeControl = "boolean"
        setPower(confel)
      }
      if(item.type==="dimmer"){
        confel.typeControl = "range"
        setDimmer(confel)
      }
    }
  },[deviceData])

  const changeHandler = event => {
    setDevice({ ...device, [event.target.name]: event.target.value })
  }
  const changeHandlerPower = event => {
    setPower({ ...power, [event.target.name]: event.target.value })
  }
  const changeHandlerDimmer = event => {
    setDimmer({ ...dimmer, [event.target.name]: event.target.value })
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
    if(!dimmer||!dimmer.type||!dimmer.address)return false
    return true
  }
  const outHandler = async ()=>{
    if(!valid()){
      return message("не все поля заполнены","error")
    }
    let conf = []
    if(power.address)
      conf.push(power)
    if(dimmer.address)
      conf.push(dimmer)
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
      <HidingLi title = "Power config">
        <label>
          <h5>power topic</h5>
          <input className = "textInput" placeholder="power" id="power" type="text" name="address" value={power.address} onChange={changeHandlerPower} required/>
        </label>
        <label>
          <h5>turn on signal</h5>
          <input className = "textInput" placeholder="turnOnSignal" id="turnOnSignal" type="text" name="high" value={power.high} onChange={changeHandlerPower} required/>
        </label>
        <label>
          <h5>turn off signal</h5>
          <input className = "textInput" placeholder="turnOffSignal" id="turnOffSignal" type="text" name="low" value={power.low} onChange={changeHandlerPower} required/>
        </label>
      </HidingLi>
      <HidingLi title = "Dimmer">
      <label>
        <h5>lavel light topic</h5>
        <input className = "textInput" placeholder="lavelLight" id="lavelLight" type="text" name="address" value={dimmer.address} onChange={changeHandlerDimmer} required/>
      </label>
      <label>
        <h5>max light</h5>
        <input className = "textInput" placeholder="maxLight" id="maxLight" type="number" name="high" value={dimmer.high} onChange={changeHandlerDimmer} required/>
      </label>
      <label>
        <h5>min light</h5>
        <input className = "textInput" placeholder="minLight" id="minLight" type="number" name="low" value={dimmer.low} onChange={changeHandlerDimmer} required/>
      </label>
      </HidingLi>
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
