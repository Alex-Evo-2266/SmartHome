import React,{useContext, useEffect, useState} from 'react'
import {useMessage} from '../../hooks/message.hook'
import {IconChoose} from '../../components/iconChoose'
import { TypeDeviceContext } from '../../components/typeDevices/typeDevicesContext';

const getConfig = (configs, name)=>{
	if (Array.isArray(configs))
	{
		let filterdata = configs.filter((item)=>item.title === name)
		if (filterdata.length > 0)
			return filterdata[0].addConfig
	}
}

export const AddDevicesPage2 = ({form, setForm, next,backPage, begining = []}) => {
  const {message} = useMessage();
  const [fields, setFields] = useState(begining)
  const types = useContext(TypeDeviceContext)
  const [config] = useState(getConfig(types.type, form.typeConnect))

  const updata = (key, value)=>{
    setForm({...form, [key]:value})
  }

  useEffect(()=>{
	console.log(config)
	let formc = {...form}
	if (![null, undefined].includes(config.address))
		formc.address = config.address
	if (![null, undefined].includes(config.token))
		formc.token = config.token
	if (![null, undefined].includes(config.valueType))
		formc.valueType = config.valueType
  },[config])

  const changeHandlerField = event => {
    let index = event.target.dataset.id
    let arr = fields.slice()
    let newcom = { ...arr[index], [event.target.name]: event.target.value }
    arr[index] = newcom
    setFields(arr)
  }

  const changeIcon = (val, id) => {
    let index = id
    let arr = fields.slice()
    let newcom = { ...arr[index], icon: val}
    arr[index] = newcom
    setFields(arr)
  }

  const changeHandlerFieldChek = event => {
    let index = event.target.dataset.id
    let arr = fields.slice()
    let newcom = { ...arr[index], [event.target.name]: event.target.checked }
    arr[index] = newcom
    setFields(arr)
  }

  const removeField = (index)=>{
    setFields(fields.filter((item, index2)=>index2 !== index))
  }

  const validFields = ()=>{
    let arrType = []
    if(!form.address && [null, undefined].includes(config?.address)){
      message("нет адреса","error")
      return false
    }
    if(config?.fields && !fields[0]){
      message("нет полей","error")
      return false
    }
	if(config?.fields && fields[0])
	{
		for (var item of fields) {
			if(!item.address || !item.name){
			  message("некоректное поле","error")
			  return false
			}
			for (var item2 of arrType) {
			  if(item.name === item2){
				message("повторяющиеся поля","error")
				return false
			  }
			}
			arrType.push(item.name)
		}
	}
    return true
  }

  const addField = ()=>{
    let arr = fields.slice()
    arr.push({
      address:"",
      name:"",
      type:"text",
      low:"0",
      high:"100",
      values:"",
      control:true,
      icon:"fas fa-circle-notch",
      unit:""
    })
    setFields(arr)
  }

  const nextPage = ()=>{
    updata("fields",fields)
    if(validFields())
      next()
  }

  const informationParse = (str)=>str.split("\n")

  return(
    <div className="allFon">
		{
			(config.description)?
			<div className="configElement block">
				{
					informationParse(config.description).map((item, index)=>(<p key={index}>{item}</p>))
				}
			</div>
			:null
		}
		{
			([null, undefined].includes(config?.address))?
			<div className="configElement">
      			<div className="input-data">
        			<input onChange={(e)=>updata(e.target.name, e.target.value)} required name="address" type="text" value={form.address}></input>
        			<label>Address</label>
     			</div>
    		</div>:
			null
		}
		{
			([null, undefined].includes(config?.valueType))?
			<div className="configElement">
      			<div className="input-data">
        			<select className = "textInput" name="valueType" value={form.valueType} onChange={(e)=>updata(e.target.name, e.target.value)}>
          				<option value="json">json</option>
          				<option value="value">value</option>
        			</select>
        			<label>Type value</label>
      			</div>
    		</div>:
			null
		}
		{
			([null, undefined].includes(config?.token))?
			<div className="configElement">
      			<div className="input-data">
				  	<input onChange={(e)=>updata(e.target.name, e.target.value)} required name="token" type="text" value={form.token}></input>
        			<label>Token</label>
      			</div>
    		</div>:
			null
		}
      <div className="fieldsConteiner">
      {
		(config?.fields)?
        fields?.map((item, index)=>{
          return(
            <div key={index} className="fieldConteiner">
            <div className="configElement">
              <div className="input-data">
                <input data-id={index} onChange={changeHandlerField} required name="name" type="text" value={item.name}></input>
                <label>name field</label>
              </div>
            </div>
            <div className="configElement">
              <div className="input-data">
                <input data-id={index} onChange={changeHandlerField} required name="address" type="text" value={item.address}></input>
                <label>address field</label>
              </div>
            </div>
            <div className="configElement">
              <div className="input-data">
                <select className = "textInput" data-id={index} name="type" value={item.type} onChange={changeHandlerField}>
                  <option value="binary">binary</option>
                  <option value="text">text</option>
                  <option value="number">number</option>
                  <option value="enum">enum</option>
                </select>
                <label>type</label>
              </div>
            </div>
            <div className="configElement" style={{justifyContent:"center"}}>
              <div className="checkbox-btn">
                <input data-id={index} type="checkbox" placeholder="unit" name="control" checked={Boolean(item.control)} onChange={changeHandlerFieldChek} required/>
                <div><span className="slide"></span></div>
              </div>
            </div>
            {
              (item.type==="number"||item.type==="binary")?
              <>
              <div className="configElement">
                <div className="input-data">
                  <input data-id={index} type={(item.type==="number")?"number":"text"} name="low" value={item.low} onChange={changeHandlerField} required/>
                  <label>min</label>
                </div>
              </div>
              <div className="configElement">
                <div className="input-data">
                  <input data-id={index} type={(item.type==="number")?"number":"text"} name="high" value={item.high} onChange={changeHandlerField} required/>
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
            <div className="buttons">
              <button className="normalSelection button" onClick={()=>removeField(index)}>delete field</button>
            </div>
            </div>
          )
        }):
		null
      }
      <div className="buttons">
		{
			(config?.fields)?
			<button style={{marginLeft:"10px"}} className="normalSelection button" onClick={addField}>add field</button>
			:null
		}
        <button style={{marginLeft:"10px"}} className="normalSelection button" onClick={backPage}>Back</button>
        <button style={{marginLeft:"10px"}} className="highSelection button" onClick={nextPage}>Next</button>
      </div>
      </div>
    </div>
  )
}
