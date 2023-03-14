import React,{useCallback, useEffect, useState} from 'react'
import { useSelector } from 'react-redux'
import { HidingDiv } from '../../../../components/hidingDiv'
import { useDeviceOptions } from '../../../../hooks/deviceOption.hook'
import { FieldBinary } from './binary'
import { FieldEnum } from './enum'
import { IconChoose } from './iconChoose'
import { FieldNumber } from './number'
import { FieldText } from './text'

export const FieldComponent = ({options, setField, field, del, deviceType}) => {

	console.log(options, setField, field, del)
	const types = useSelector(state=>state.options.types)
	const [fieldName, setFieldName] = useState("other")
	const {getType} = useDeviceOptions()
	const [fieldL, setFieldL] = useState({
		address: "",
		name: "",
		value: "",
		type: "",
		low: "",
		high: "",
		enum_values: "",
		control: true,
		icon: "fas fa-circle-notch",
		unit: ""
	})

	useEffect(()=>{
		setFieldL({
			address: field?.address??"",
			name: field?.name??"",
			value: field?.value??"",
			type: field?.type??"",
			low: field?.low??"",
			high: field?.high??"",
			enum_values: field?.enum_values??"",
			control: field?.control??false,
			icon: field?.icon??"fas fa-circle-notch",
			unit: field?.unit??"",
		})
	},[])

	const changeField = (e)=>{
		let newField = {...fieldL, [e.target.name]:e.target.value}
		setFieldL(newField)
		setField(newField)
	}

	const changeFieldName = (e)=>{
		setFieldName(e.target.value)
		if (e.target.value === "other")
			return;
		let t = types.filter(item=>item.name===deviceType)
		let f = t[0]?.fields
		f = f?.filter(item => item.name === e.target.value)
		f = f[0]
		console.log(f)
		let newField = {...fieldL, name:e.target.value, type: f.type}
		setFieldL(newField)
		setField(newField)
	}

	const fieldNames = useCallback(()=>{
		let t = types.filter(item=>item.name===deviceType)
		return t[0]?.fields ?? []
	},[types])

	const IconField = (data)=>{
		let newField = {...fieldL, icon:data}
		setFieldL(newField)
		setField(newField)
	}

	const changeType = (e)=>{
		let newField = {...fieldL, [e.target.name]:e.target.value}
		if(e.target.value==="number")
		{
			newField.low = "0"
			newField.high = "100"
		}
		else if(e.target.value==="binary")
		{
			newField.low = "false"
			newField.high = "true"
		}
		setFieldL(newField)
		setField(newField)
	}

	const deleteFields = ()=>{
		if(typeof(del)==="function")
			del()
	}

  return(
	<HidingDiv title={fieldL.name} dopHeight={200}>
		<div className="configElement">
			<div className="input-data">
				<select onChange={changeFieldName} required name="fieldName" value={fieldName}>
					<option value={"other"}>other</option>
					{
						fieldNames().map((item, index)=>
							(<option key={index} value={item.name}>{item.name}</option>)
						)
					}
				</select>
				<label>choise name</label>
			</div>
		</div>
		{
			(fieldName === "other")?
				<>
				<div className="configElement">
					<div className="input-data">
						<input onChange={changeField} required name="name" type="text" value={fieldL.name}></input>
						<label>name</label>
					</div>
				</div>
				<div className="configElement">
				<div className="input-data">
					<select onChange={changeType} required name="type" value={fieldL.type}>
						<option value={"binary"}>binary</option>
						<option value={"number"}>number</option>
						<option value={"text"}>text</option>
						<option value={"enum"}>enum</option>
					</select>
					<label>type</label>
				</div>
			</div>
			</>:
			<div className="configElement">
				<div className="input-data">
					type: {fieldL.type}
				</div>
			</div>
		}
		
		<div className="configElement">
			<div className="input-data">
				<select onChange={changeField} required name="control" value={fieldL.control}>
					<option value={true}>managed</option>
					<option value={false}>display only</option>
				</select>
				<label>control</label>
			</div>
		</div>
		{
		(options.address)?
		<div className="configElement">
			<div className="input-data">
				<input onChange={changeField} required name="address" type="text" value={fieldL.address}></input>
				<label>address</label>
			</div>
		</div>:
		null
		}
		{
		(fieldL.type==="binary")?
		<FieldBinary field={fieldL} change={changeField}/>:
		(fieldL.type==="number")?
		<FieldNumber field={fieldL} change={changeField}/>:
		(fieldL.type==="text")?
		<FieldText field={fieldL} change={changeField}/>:
		(fieldL.type==="enum")?
		<FieldEnum field={fieldL} change={changeField}/>:
		null
		}
		<IconChoose value={fieldL.icon} change={IconField}/>
		<div className="card-btn-container">
			<button onClick={deleteFields} className='btn red'>delete</button>
		</div>
	</HidingDiv>
  )
}
