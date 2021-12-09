import React, {useState,useEffect,useContext} from 'react'
import {HidingLi} from '../../../hidingLi.js'
import {useHttp} from '../../../../hooks/http.hook'
import {useMessage} from '../../../../hooks/message.hook'
import {AuthContext} from '../../../../context/AuthContext.js'
import {IconChoose} from '../../../iconChoose'
import {useChecked} from '../../../../hooks/checked.hook'

export const DeviceVariableEdit = ({deviceData,hide,type="edit"})=>{
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
    information:deviceData.information||"",
    name:deviceData.name||"",
    systemName:deviceData.systemName||"",
    newSystemName:deviceData.systemName||"",
    type:deviceData.type||"other",
    valueType:deviceData.valueType||"json",
    address:deviceData.address||"",
    typeConnect:deviceData.typeConnect||"mqtt",
    RoomId:deviceData.RoomId,
  })
  const [field, setField] = useState(deviceData.config||[]);
  const [count, setCount] = useState(deviceData.config.length);

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

  const changeIcon = (val, id) => {
    let index = id
    let arr = field.slice()
    let newcom = { ...arr[index], icon: val}
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
      !device.systemName||
      !device.valueType||
      !device.name||
      !device.type||
      !device.typeConnect
    ){return false}
    if(!field||!field[0]){return false}
    for (var item of field) {
      if(!(item?.type)){return false}
    }
    return true
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
    message("All dependent scripts and controls will be removed along with the device. Delete?","general",async()=>{
      await request(`/api/devices/del/${device.systemName}`, 'DELETE', null,{Authorization: `Bearer ${auth.token}`})
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
          <h5>{`Type - ${device.type}`}</h5>
          <h5>{`Type connect - ${device.typeConnect}`}</h5>
        </label>
      </li>
      <div className="configElement">
        <div className="input-data">
          <input onChange={changeHandler} required name="name" type="text" value={device.name}></input>
          <label>Name</label>
        </div>
      </div>
      <div className="configElement">
        <div className="input-data">
          <input onChange={changeHandlerTest} required name="newSystemName" type="text" value={device.newSystemName}></input>
          <label>System name</label>
        </div>
      </div>
      <div className="configElement">
        <div className="input-data">
          <select name="valueType" value={device.valueType} onChange={changeHandler}>
            <option value="json">json</option>
            <option value="value">value</option>
          </select>
          <label>Type value</label>
        </div>
      </div>
      <div className="configElement">
        <div className="input-data">
          <input onChange={changeHandler} required name="information" type="text" value={device.information}></input>
          <label>Information</label>
        </div>
      </div>
      {
        field.map((item,index)=>{
          return(
            <HidingLi key={index} title = {item.name}>
              <div className="configElement">
                <div className="input-data">
                  <input data-id={index} type="text" name="name" value={item.name} onChange={changeHandlerField} required/>
                  <label>name</label>
                </div>
              </div>
              <div className="configElement">
                <div className="input-data">
                  <select data-id={index} name="type" value={item.type} onChange={changeHandlerField}>
                    <option value="binary">binary</option>
                    <option value="text">text</option>
                    <option value="number">number</option>
                    <option value="enum">enum</option>
                  </select>
                <label>type</label>
              </div>
            </div>
            {
              (item.type==="number"||item.type==="binary")?
              <>
              <div className="configElement">
                <div className="input-data">
                  <input data-id={index} type={(item.type==="range")?"number":"text"} name="low" value={item.low} onChange={changeHandlerField} required/>
                  <label>min</label>
                </div>
              </div>
              <div className="configElement">
                <div className="input-data">
                  <input data-id={index} type={(item.type==="range")?"number":"text"} name="high" value={item.high} onChange={changeHandlerField} required/>
                  <label>max</label>
                </div>
              </div>
              </>:
              (item.type==="enum")?
              <div className="configElement">
                <div className="input-data">
                  <input data-id={index} type="text" name="values" value={item.values} onChange={changeHandlerField} required/>
                  <label>enum</label>
                </div>
              </div>
              :null
            }
            <IconChoose dataId={index} value={item.icon} onChange={changeIcon}/>
            {
              (item.type==="number")?
              <div className="configElement">
                <div className="input-data">
                  <input data-id={index} name="unit" value={item.unit} onChange={changeHandlerField} required/>
                  <label>unit</label>
                </div>
              </div>:null
            }
              <label>
                <button className="delField" onClick={()=>delcom(index)}>delete</button>
              </label>
            </HidingLi>
          )
        })
      }
        <li>
          <button className="addField" onClick={addcom}>add</button>
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
