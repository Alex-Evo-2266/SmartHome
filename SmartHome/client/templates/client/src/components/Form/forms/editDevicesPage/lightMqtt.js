import React, {useState,useEffect,useContext} from 'react'
import {HidingLi} from '../../../hidingLi.js'
import {useHttp} from '../../../../hooks/http.hook'
import {useMessage} from '../../../../hooks/message.hook'
import {AuthContext} from '../../../../context/AuthContext.js'
import {useChecked} from '../../../../hooks/checked.hook'


export const LightMqttEdit = ({deviceData,hide})=>{
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
    DeviceName:deviceData.DeviceName,
    DeviceSystemName:deviceData.DeviceSystemName,
    DeviceType:deviceData.DeviceType,
    DeviceTypeConnect:deviceData.DeviceTypeConnect,
    RoomId:deviceData.RoomId,
    power:deviceData.DeviceConfig.power,
    status:deviceData.DeviceConfig.status,
    turnOnSignal:deviceData.DeviceConfig.turnOnSignal,
    turnOffSignal:deviceData.DeviceConfig.turnOffSignal,
    dimmer:deviceData.DeviceConfig.dimmer,
    maxDimmer:deviceData.DeviceConfig.maxDimmer,
    minDimmer:deviceData.DeviceConfig.minDimmer,
    color:deviceData.DeviceConfig.color,
    maxColor:deviceData.DeviceConfig.maxColor,
    minColor:deviceData.DeviceConfig.minColor,
    mode:deviceData.DeviceConfig.mode,
    countMode: deviceData.DeviceConfig.countMode
  })

  const changeHandler = event => {
    setDevice({ ...device, [event.target.name]: event.target.value })
  }
  const changeHandlerTest = event=>{
    if(USText(event.target.value)){
      changeHandler(event)
      return ;
    }
    message("forbidden symbols","error")
  }
  const outHandler = async ()=>{
    let dataout = {DeviceConfig:{}}
    for(let key in device){
      if(key.indexOf("Device")!==0&&key!=="RoomId"){
        dataout.DeviceConfig[key] = device[key]
      }
      else{
        dataout[key] = device[key]
      }
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
          <h5>status</h5>
          <input className = "textInput" placeholder="status" id="status" type="text" name="status" value={device.status} onChange={changeHandler} required/>
        </label>
      </li>
      <HidingLi title = "power config">
        <label>
          <h5>power topic</h5>
          <input className = "textInput" placeholder="power" id="power" type="text" name="power" value={device.power} onChange={changeHandler} required/>
        </label>
        <label>
          <h5>turn on signal</h5>
          <input className = "textInput" placeholder="turnOnSignal" id="turnOnSignal" type="text" name="turnOnSignal" value={device.turnOnSignal} onChange={changeHandler} required/>
        </label>
        <label>
          <h5>turn off signal</h5>
          <input className = "textInput" placeholder="turnOffSignal" id="turnOffSignal" type="text" name="turnOffSignal" value={device.turnOffSignal} onChange={changeHandler} required/>
        </label>
      </HidingLi>
      <HidingLi title = "Dimmer">
      <label>
        <h5>lavel light topic</h5>
        <input className = "textInput" placeholder="lavelLight" id="lavelLight" type="text" name="dimmer" value={device.dimmer} onChange={changeHandler} required/>
      </label>
      <label>
        <h5>max light</h5>
        <input className = "textInput" placeholder="maxLight" id="maxLight" type="text" name="maxDimmer" value={device.maxDimmer} onChange={changeHandler} required/>
      </label>
      <label>
        <h5>min light</h5>
        <input className = "textInput" placeholder="minLight" id="minLight" type="text" name="minDimmer" value={device.minDimmer} onChange={changeHandler} required/>
      </label>
      </HidingLi>
      <HidingLi title = "Color">
      <label>
        <h5>color topic</h5>
        <input className = "textInput" placeholder="color" id="color" type="text" name="color" value={device.color} onChange={changeHandler} required/>
      </label>
      <label>
        <h5>max color</h5>
        <input className = "textInput" placeholder="max color" id="maxColor" type="text" name="maxColor" value={device.maxColor} onChange={changeHandler} required/>
      </label>
      <label>
        <h5>min color</h5>
        <input className = "textInput" placeholder="min color" id="minColor" type="text" name="minColor" value={device.minColor} onChange={changeHandler} required/>
      </label>
      </HidingLi>
      <HidingLi title = "Mode">
      <label>
        <h5>mode topic</h5>
        <input className = "textInput" placeholder="mode" id="mode" type="text" name="mode" value={device.mode} onChange={changeHandler} required/>
      </label>
      <label>
        <h5>count mode</h5>
        <input className = "textInput" placeholder="countMode" id="countMode" type="text" name="countMode" value={device.countMode} onChange={changeHandler} required/>
      </label>
      </HidingLi>
      <div className="controlForm" >
        <button className="formEditBtn Delete" onClick={deleteHandler}>Delete</button>
        <button className="formEditBtn" onClick={outHandler}>Save</button>
      </div>
    </ul>
  )

}
