import React, {useState,useEffect,useContext} from 'react'
import {useHttp} from '../../../../hooks/http.hook'
import {useMessage} from '../../../../hooks/message.hook'
import {HidingLi} from '../../../hidingLi.js'
import {IconChoose} from '../../../iconChoose'
import {AuthContext} from '../../../../context/AuthContext.js'
import {useChecked} from '../../../../hooks/checked.hook'

export const DeviceMiioEdit = ({deviceData,hide,type="edit"})=>{
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
    information:deviceData.information,
    name:deviceData.name,
    systemName:deviceData.systemName,
    newSystemName:deviceData.systemName,
    type:deviceData.type,
    address:deviceData.address,
    typeConnect:deviceData.typeConnect,
    RoomId:deviceData.RoomId,
  })
  const [field, setField] = useState(deviceData.fields||[]);

  const changeIcon = (val, id) => {
    let index = id
    let arr = field.slice()
    let newcom = { ...arr[index], icon: val}
    arr[index] = newcom
    setField(arr)
  }
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
    let dataout = {
      ...device,
      fields:field
    }
    if(type==="edit")
      await request(`/api/device/edit`, 'POST', {...dataout},{Authorization: `Bearer ${auth.token}`})
    else if(type==="link")
      await request('/api/device/add', 'POST', {...dataout},{Authorization: `Bearer ${auth.token}`})
    hide();
  }

  const deleteHandler = async () =>{
    message("All dependent scripts and controls will be removed along with the device. Delete?","general",async()=>{
      await request(`/api/device/delete/${device.systemName}`, 'POST', null,{Authorization: `Bearer ${auth.token}`})
      hide();
    },"no")
  }

  return (
    <ul className="editDevice">
      <li>
        <label>
          <h5>{`Type - ${device.type}`}</h5>
          <h5>{`Type connect - ${device.typeConnect}`}</h5>
        </label>
      </li>
      <li>
        <label>
          <h5>Name</h5>
          <input className = "textInput" placeholder="name" id="name" type="text" name="name" value={device.name} onChange={changeHandler} required/>
        </label>
      </li>
      <li>
        <label>
          <h5>System name</h5>
          <input className = "textInput" placeholder="system name" id="newSystemName" type="text" name="newSystemName" value={device.newSystemName} onChange={changeHandlerTest} required/>
        </label>
      </li>
      <li>
        <label>
          <h5>Address</h5>
          <input className = "textInput" placeholder="address" id="address" type="text" name="address" value={device.address} onChange={changeHandler} required/>
        </label>
      </li>
      <li>
        <label>
          <h5>information</h5>
          <input className = "textInput" placeholder="information" id="information" type="text" name="information" value={device.information} onChange={changeHandler} required/>
        </label>
      </li>
      {
        field.map((item, index)=>{
          return(
            <HidingLi key={index} title = {item.name}>
              <IconChoose dataId={index} value={item.icon} onChange={changeIcon}/>
            </HidingLi>
          )
        })
      }
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
