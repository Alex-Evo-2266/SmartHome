import React,{useCallback, useEffect, useState} from 'react'
import { useDispatch } from 'react-redux'
import { HidingDiv } from '../../../components/hidingDiv'
import { Loader } from '../../../components/Loader'
import { FieldComponent } from './fields/fieldComponent'

const defField = {
	address: "",
	name: "",
	value: "",
	type: "number",
	low: "0",
	high: "100",
	enum_values: "",
	control: true,
	icon: "fas fa-circle-notch",
	unit: ""
  }

export const FieldDevicePage = ({options, setDevice, device, next, prev}) => {

	const [loading, setLoading] = useState(false)

	const changeHandler = (e)=>{
		setDevice(prev=>({...prev, [e.target.name]:e.target.value}))
	}

	const setField = (field, index)=>{
		let arr = device?.fields.slice()
		arr[index] = field
		setDevice(prev=>({...prev, fields:arr}))
	}

	const addField = ()=>{
		let arr = device?.fields.slice()
		arr.push(defField)
		setDevice(prev=>({...prev, fields:arr}))
	}

	const delField = (index1)=>{
		let arr = device?.fields.slice().filter((item, index2)=>index1 !== index2)
		setDevice(prev=>({...prev, fields:arr}))
		setLoading(true)
		setTimeout(()=>setLoading(false), 10)
	}

	useEffect(()=>{
		if(!options.fields && typeof(next)==="function")
			next()
	},[options, next])

	if(loading)
		return(<Loader/>)

  return(
	<div className='pagecontent card-container'>
		<h2>Field</h2>
		{
		(options.address)?
		<div className="configElement">
      		<div className="input-data">
				<select name="value_type" value={device.value_type} onChange={changeHandler}>
					<option value="json">json</option>
					<option value="value">value</option>
				</select>
        		<label>value type</label>
      		</div>
    	</div>:
		null
		}
		{
			device?.fields.map((item, index)=><FieldComponent del={()=>delField(index)} setField={(data)=>setField(data, index)} options={options} key={index} field={item}/>)
		}
		<div className="card-btn-container">
			<button className='btn border' onClick={prev}>back</button>
			<button className='btn' onClick={addField}>add field</button>
			<button className='btn' onClick={next}>next</button>
		</div>
	</div>
  )
}
