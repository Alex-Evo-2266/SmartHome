import React, {useState,useEffect,useContext} from 'react'
import {HidingLi} from '../../../hidingLi.js'
import {useHttp} from '../../../../hooks/http.hook'
import {useMessage} from '../../../../hooks/message.hook'
import {AuthContext} from '../../../../context/AuthContext.js'
import {getConf} from '../../../addDeviceComponent/config/defaultTypeDevConfig'
import {useChecked} from '../../../../hooks/checked.hook'

export const DeviceMqttEdit = ({deviceData,hide,type="edit"})=>{
  const auth = useContext(AuthContext)
  const {message} = useMessage();
  const {USText} = useChecked()
  const [configForm, setConfigForm] = useState(getConf(deviceData.DeviceType||"other"));
  const {request, error, clearError} = useHttp();

  const validCountField = (data)=>{
    if(!deviceData.DeviceType||deviceData.DeviceType==="other"||deviceData.DeviceType==="sensor")return data
    let data1 = getConf(deviceData.DeviceType||"other").config.slice()
    let newdata = []
    for (var item of data1) {
      let validef = false
      for (var item2 of data) {
        if(item.name===item2.name){
          validef = true
          newdata.push(item2)
        }
      }
      if(!validef){
        let newField = item
        newField.address = ""
        newdata.push(newField)
      }
    }
    return newdata
  }

  useEffect(()=>{
    message(error,"error")
    return ()=>{
      clearError();
    }
  },[error,message, clearError])

  useEffect(()=>{
    setConfigForm(getConf(deviceData.DeviceType))
  },[deviceData.DeviceType])

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
  const [field, setField] = useState(validCountField(deviceData.DeviceConfig||[]));
  const [count, setCount] = useState(deviceData.DeviceConfig.length);

  useEffect(()=>{
    console.log(field);
  },[field])

  const changeHandler = event => {
    setDevice({ ...device, [event.target.name]: event.target.value })
  }
  const changeHandlerField = event => {
    let index = event.target.dataset.id
    let arr = field.slice()
    let newcom = { ...arr[index], [event.target.name]: event.target.value }
    arr[index] = newcom
    setField(arr)
  }

  const changeHandlerFieldChek = event => {
    let index = event.target.dataset.id
    let arr = field.slice()
    let newcom = { ...arr[index], [event.target.name]: event.target.checked }
    arr[index] = newcom
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
      if(item&&item.type&&item.address){return true}
    }
    return false
  }
  const validFields = ()=>{
    let arrType = []
    for (var item of field) {
      for (var item2 of arrType) {
        if(item.name === item2){
          message("повторяющиеся поля","error")
          return false
        }
      }
      arrType.push(item.name)
    }
    return true
  }
  const outHandler = async ()=>{
    if(!valid()){
      return message("не все поля заполнены","error")
    }
    if(!validFields()){
      return
    }
    let conf = []
    for (var item of field) {
      if(item.address)
        conf.push(item)
    }
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
    let arr = field.slice()
    arr.push({
      address:"field"+count,
      name:"field"+count,
      type:"text",
      low:"0",
      high:"100",
      values:"",
      control:true,
      icon:"",
      unit:""
    })
    setCount((prev)=>prev+1)
    setField(arr)
  }

  const delcom = (index)=>{
    let arr = field.slice()
    arr = arr.filter((it,index2)=>index!==index2)
    arr = arr.map((item,i)=>{
      return {...item,type:"c"+i}
    })
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
          <select className = "textInput" name="DeviceValueType" value={device.DeviceValueType} onChange={changeHandler}>
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
            <HidingLi key={index} title = {item.name}>
            {
              (configForm.editType)?
              <label>
                <h5>Enter the type</h5>
                <input data-id={index} className = "textInput" placeholder="type" type="text" name="name" value={item.name} onChange={changeHandlerField} required/>
              </label>:null
            }
            <label>
              <h5>Enter the address</h5>
              <input data-id={index} className = "textInput" placeholder="address" type="text" name="address" value={item.address} onChange={changeHandlerField} required/>
            </label>
            {
              (configForm.editTypeControl)?
              <label>
                <h5>Type</h5>
                <select className = "textInput" data-id={index} name="type" value={item.type} onChange={changeHandlerField}>
                  <option value="binary">binary</option>
                  <option value="text">text</option>
                  <option value="number">number</option>
                  <option value="enum">enum</option>
                </select>
              </label>:null
            }
            <label>
              <h5>Enter the control</h5>
              <input data-id={index} type="checkbox" className = "textInput" placeholder="unit" name="control" checked={Boolean(item.control)} onChange={changeHandlerFieldChek} required/>
            </label>
            {
              (item.type==="number"||item.type==="binary")?
              <>
              <label>
                <h5>Enter the min</h5>
                <input data-id={index} className = "textInput" placeholder="min" type={(item.type==="range")?"number":"text"} name="low" value={item.low} onChange={changeHandlerField} required/>
              </label>
              <label>
                <h5>Enter the max</h5>
                <input data-id={index} className = "textInput" placeholder="max" type={(item.type==="range")?"number":"text"} name="high" value={item.high} onChange={changeHandlerField} required/>
              </label>
              </>:
              (item.type==="enum")?
              <label>
                <h5>Enter the enum</h5>
                <input data-id={index} className = "textInput" placeholder="enum" type="text" name="values" value={item.values} onChange={changeHandlerField} required/>
              </label>
              :null
            }
            <label>
              <h5>Enter the icon</h5>
              <input data-id={index} className = "textInput" placeholder="icon" name="icon" value={item.icon} onChange={changeHandlerField} required/>
            </label>
            {
              (item.type==="number")?
              <label>
                <h5>Enter the unit</h5>
                <input data-id={index} className = "textInput" placeholder="unit" name="unit" value={item.unit} onChange={changeHandlerField} required/>
              </label>:null
            }
            {
              (configForm.editCountField)?
              <label>
                <button className="delField" onClick={()=>delcom(index)}>delete</button>
              </label>:null
            }
            </HidingLi>
          )
        })
      }
      {
        (configForm.editCountField)?
        <li>
          <button className="addField" onClick={addcom}>add</button>
        </li>
        :null
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
