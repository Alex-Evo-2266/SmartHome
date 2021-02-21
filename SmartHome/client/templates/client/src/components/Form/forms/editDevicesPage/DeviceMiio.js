import React, {useState,useEffect,useContext} from 'react'
import {HidingLi} from '../../../hidingLi.js'
import {useHttp} from '../../../../hooks/http.hook'
import {useMessage} from '../../../../hooks/message.hook'
import {AuthContext} from '../../../../context/AuthContext.js'
import {useChecked} from '../../../../hooks/checked.hook'

export const DeviceMiioEdit = ({deviceData,hide})=>{
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

  const [status, setStatus] = useState({
    type:"base",
    address:"",
    token:"",
  })
  useEffect(()=>{
    console.log(deviceData);
    for (var item of deviceData.DeviceConfig) {
      let confel = {
        type:item.type,
        address:item.address,
        token:item.token
      }
      if(item.type==="base"){
        setStatus(confel)
      }
    }
  },[deviceData])

  const [device, setDevice] = useState({
    DeviceId:deviceData.DeviceId,
    DeviceInformation:deviceData.DeviceInformation,
    DeviceName:deviceData.DeviceName,
    DeviceSystemName:deviceData.DeviceSystemName,
    DeviceType:deviceData.DeviceType,
    DeviceTypeConnect:deviceData.DeviceTypeConnect,
    RoomId:deviceData.RoomId,
  })

  const changeHandler = event => {
    setDevice({ ...device, [event.target.name]: event.target.value })
  }
  const changeHandlerStatus = event => {
    setStatus({ ...status, [event.target.name]: event.target.value })
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
      <HidingLi title = "device config" show = {true}>
      <label>
        <h5>id device</h5>
        <input className = "textInput" placeholder="topic status" type="text" name="address" value={status.address} onChange={changeHandlerStatus} required/>
      </label>
      <label>
        <h5>token</h5>
        <input className = "textInput" placeholder="topic status" type="text" name="token" value={status.token} onChange={changeHandlerStatus} required/>
      </label>
      </HidingLi>
      <div className="controlForm" >
        <button className="formEditBtn Delete" onClick={deleteHandler}>Delete</button>
        <button className="formEditBtn" onClick={outHandler}>Save</button>
      </div>
    </ul>
  )

}
