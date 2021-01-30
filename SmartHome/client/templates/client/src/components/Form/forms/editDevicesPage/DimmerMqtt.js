import React, {useState,useEffect,useContext} from 'react'
import {HidingLi} from '../../../hidingLi.js'
import {useHttp} from '../../../../hooks/http.hook'
import {useMessage} from '../../../../hooks/message.hook'
import {AuthContext} from '../../../../context/AuthContext.js'
import {useChecked} from '../../../../hooks/checked.hook'


export const DimmerMqttEdit = ({deviceData,hide})=>{
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
    DeviceId:deviceData.DeviceId,
    DeviceInformation:deviceData.DeviceInformation,
    DeviceSystemName:deviceData.DeviceSystemName,
    DeviceName:deviceData.DeviceName,
    DeviceType:deviceData.DeviceType,
    DeviceTypeConnect:deviceData.DeviceTypeConnect,
    RoomId:deviceData.RoomId,
  })
  const [status, setStatus] = useState({
    type:"status",
    address:"",
    low:"",
    high:"",
    icon:""
  })
  const [power, setPower] = useState({
    type:"power",
    address:"",
    low:"",
    high:"",
    icon:""
  })
  const [dimmer, setDimmer] = useState({
    type:"dimmer",
    address:"",
    low:"",
    high:"",
    icon:""
  })

  useEffect(()=>{
    console.log(deviceData);
    for (var item of deviceData.DeviceConfig) {
      let confel = {
        type:item.type,
        address:item.address,
        low:item.low||"",
        high:item.high||"",
        icon:item.icon||""
      }
      if(item.type==="status"){
        setStatus(confel)
      }
      if(item.type==="power"){
        setPower(confel)
      }
      if(item.type==="dimmer"){
        setDimmer(confel)
      }
    }
  },[])

  const changeHandler = event => {
    setDevice({ ...device, [event.target.name]: event.target.value })
  }
  const changeHandlerStatus = event => {
    setStatus({ ...status, [event.target.name]: event.target.value })
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
  const outHandler = async ()=>{
    let conf = []
    if(status.address)
      conf.push(status)
    if(power.address)
      conf.push(power)
    if(dimmer.address)
      conf.push(dimmer)
    let dataout = {
      ...device,
      config:conf
    }
    await request(`/api/devices/edit`, 'POST', {...dataout},{Authorization: `Bearer ${auth.token}`})
    hide();
  }

  const deleteHandler = async () =>{
    message("All dependent scripts and controls will be removed along with the device. Delete?","dialog",async()=>{
      await request(`/api/devices/delete`, 'POST', {DeviceId:device.DeviceId},{Authorization: `Bearer ${auth.token}`})
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
          <h5>information</h5>
          <input className = "textInput" placeholder="information" id="DeviceInformation" type="text" name="DeviceInformation" value={device.DeviceInformation} onChange={changeHandler} required/>
        </label>
      </li>
      <li>
        <label>
          <h5>status topic</h5>
          <input className = "textInput" placeholder="powerStatus" id="powerStatus" type="text" name="address" value={status.address} onChange={changeHandlerStatus} required/>
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
        <input className = "textInput" placeholder="maxLight" id="maxLight" type="text" name="high" value={dimmer.high} onChange={changeHandlerDimmer} required/>
      </label>
      <label>
        <h5>min light</h5>
        <input className = "textInput" placeholder="minLight" id="minLight" type="text" name="low" value={dimmer.low} onChange={changeHandlerDimmer} required/>
      </label>
      </HidingLi>
      <div className="controlForm" >
        <button className="formEditBtn Delete" onClick={deleteHandler}>Delete</button>
        <button className="formEditBtn" onClick={outHandler}>Save</button>
      </div>
    </ul>
  )

}
