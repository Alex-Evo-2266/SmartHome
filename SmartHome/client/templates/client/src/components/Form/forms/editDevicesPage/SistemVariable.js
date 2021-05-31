import React, {useState,useEffect,useContext} from 'react'
import {useHttp} from '../../../../hooks/http.hook'
import {useMessage} from '../../../../hooks/message.hook'
import {AuthContext} from '../../../../context/AuthContext.js'
import {useChecked} from '../../../../hooks/checked.hook'


export const SistemVariableEdit = ({deviceData,hide,type="edit"})=>{
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
    DeviceName:deviceData.DeviceName||"",
    DeviceInformation:deviceData.DeviceInformation||"",
    DeviceSystemName:deviceData.DeviceSystemName||"",
    DeviceType:deviceData.DeviceType||"variable",
    DeviceTypeConnect:deviceData.DeviceTypeConnect||"system",
    DeviceValue:(deviceData.DeviceValue&&deviceData.DeviceValue.value)?deviceData.DeviceValue.value:""
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
  function valid() {
    if(
      !device.DeviceSystemName||
      !device.DeviceName||
      !device.DeviceType
    ){return false}
    return true
  }
  const outHandler = async ()=>{
    if(!valid()){
      return message("не все поля заполнены","error")
    }
    if(type==="edit")
      await request(`/api/devices`, 'PUT', {...device},{Authorization: `Bearer ${auth.token}`})
    else if(type==="link")
      await request('/api/devices', 'POST', {...device},{Authorization: `Bearer ${auth.token}`})
    hide();
  }

  const deleteHandler = async () =>{
    message("All dependent scripts and controls will be removed along with the device. Delete?","dialog",async()=>{
      await request(`/api/devices/${device.DeviceId}`, 'DELETE', null,{Authorization: `Bearer ${auth.token}`})
      hide();
    },"no")
  }

  useEffect(()=>{
    console.log(device);
  },[device])

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
          <h5>value</h5>
          <input className = "textInput" placeholder="Value" id="value" type="text" name="DeviceValue" value={device.DeviceValue} onChange={changeHandler} required/>
        </label>
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
