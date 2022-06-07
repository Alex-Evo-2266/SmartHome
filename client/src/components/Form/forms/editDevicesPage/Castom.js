import React, {useState,useEffect,useContext} from 'react'
import {HidingLi} from '../../../hidingLi.js'
import {useHttp} from '../../../../hooks/http.hook'
import {useMessage} from '../../../../hooks/message.hook'
import {AuthContext} from '../../../../context/AuthContext.js'
import {IconChoose} from '../../../iconChoose'
import {useChecked} from '../../../../hooks/checked.hook'
import { TypeDeviceContext } from '../../../typeDevices/typeDevicesContext.js'

const getConfig = (configs, name)=>{
	if (Array.isArray(configs))
	{
		let filterdata = configs.filter((item)=>item.title === name)
		if (filterdata.length > 0)
			return filterdata[0].editConfig
	}
}

const	isFieldEdit = (fieldConf) =>{
	for (const key in fieldConf) {
		if (fieldConf[key])
			return true
	}
	return false
}

export const CastomEdit = ({deviceData,hide,type="edit"})=>{
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
  const [field, setField] = useState(deviceData.fields||[]);
  const [count, setCount] = useState(deviceData.fields.length);
  const types = useContext(TypeDeviceContext)
  const [config] = useState(getConfig(types.type, device.typeConnect))

  useEffect(()=>{
		console.log(device,field,config);
  },[device, field])

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
    console.log(device)
    if(
      (!device.systemName && type !== "link")||
      (!device.newSystemName)||
      (!device.valueType && config.valueType)||
      (!device.address && config.address)||
      !device.name||
      !device.type||
      !device.typeConnect
    ){return false}
    if(!field){return false}
    for (var item of field) {
      if((!item?.type && config.fields.type) || (!item?.address && config.fields.address)){return false}
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
      fields:conf
    }
    if(type==="edit")
      await request(`/api/device/edit`, 'POST', {...dataout},{Authorization: `Bearer ${auth.token}`})
    else if(type==="link"){
      dataout.systemName = dataout.newSystemName
      await request('/api/device/add', 'POST', {...dataout},{Authorization: `Bearer ${auth.token}`})
    }
    hide();
  }

  const deleteHandler = async () =>{
    message("All dependent scripts and controls will be removed along with the device. Delete?","general",async()=>{
      await request(`/api/device/delete/${device.systemName}`, 'POST', null,{Authorization: `Bearer ${auth.token}`})
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
	  {
		(config.address)?
		<div className="configElement">
        	<div className="input-data">
          		<input onChange={changeHandler} required name="address" type="text" value={device.address}></input>
          		<label>Address</label>
        	</div>
      	</div>
		:null
	  }
      {
		(config.valueType)?
		<div className="configElement">
        	<div className="input-data">
          		<select name="valueType" value={device.valueType} onChange={changeHandler}>
            		<option value="json">json</option>
            		<option value="value">value</option>
          		</select>
          		<label>Type value</label>
        	</div>
      	</div>
	  	:null
	  }
      {
		(config.information)?
		<div className="configElement">
        	<div className="input-data">
          		<input onChange={changeHandler} required name="information" type="text" value={device.information}></input>
          		<label>Information</label>
        	</div>
      	</div>:null
	  }
      {
		(isFieldEdit(config.fields))?
        field.map((item,index)=>{
          return(
            <HidingLi key={index} title = {item.name}>
				{
					(config.fields.name)?
					<div className="configElement">
                		<div className="input-data">
                  			<input data-id={index} type="text" name="name" value={item.name} onChange={changeHandlerField} required/>
                  			<label>name</label>
                		</div>
              		</div>:null
				}
				{
					(config.fields.address)?
					<div className="configElement">
              			<div className="input-data">
                			<input data-id={index} type="text" name="address" value={item.address} onChange={changeHandlerField} required/>
                			<label>address</label>
              			</div>
            		</div>:null
				}
				{
					(config.fields.type)?
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
            		</div>:null
				}
				{
					(config.fields.control)?
					<div className="configElement" style={{justifyContent:"center"}}>
						<div className="checkbox-btn">
					  		<input data-id={index} type="checkbox" name="control" checked={Boolean(item.control)} onChange={changeHandlerFieldChek} required/>
					  		<div><span className="slide"></span></div>
						</div>
				  	</div>:null
				}
            {
              	(item.type==="number"||item.type==="binary")?
              	<>
			  	{
				  	(config.fields.low)?
				  	<div className="configElement">
                		<div className="input-data">
                  			<input data-id={index} type={(item.type==="range")?"number":"text"} name="low" value={item.low} onChange={changeHandlerField} required/>
                  			<label>min</label>
                		</div>
              		</div>:null
			  	}
             	{
				  	(config.fields.high)?
				  	<div className="configElement">
                		<div className="input-data">
                  			<input data-id={index} type={(item.type==="range")?"number":"text"} name="high" value={item.high} onChange={changeHandlerField} required/>
                  			<label>max</label>
                		</div>
              		</div>:null
			  	}
              	</>:
              	(item.type==="enum" && config.fields.values)?
              	<div className="configElement">
                	<div className="input-data">
                  		<input data-id={index} type="text" name="values" value={item.values} onChange={changeHandlerField} required/>
                  		<label>enum</label>
                	</div>
              	</div>
             	:null
            }
			{
				(config.fields.icon)?
				<IconChoose dataId={index} value={item.icon} onChange={changeIcon}/>
				:null
			}
            {
              	(item.type==="number" && config.fields.unit)?
              	<div className="configElement">
                	<div className="input-data">
                  		<input data-id={index} name="unit" value={item.unit} onChange={changeHandlerField} required/>
                  		<label>unit</label>
                	</div>
              	</div>:null
            }
			{
				(config.fields.delete)?
				<label>
            		<button className="delField" onClick={()=>delcom(index)}>delete</button>
            	</label>:null
			}
            </HidingLi>
          )
        }):null
      }
	  {
		(config.fields.add)?
		<li>
          	<button className="addField" onClick={addcom}>add</button>
        </li>:null
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
