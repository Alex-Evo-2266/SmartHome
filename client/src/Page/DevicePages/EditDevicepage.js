import React,{useCallback, useEffect, useRef, useState} from 'react'
import { useDispatch, useSelector} from 'react-redux'
import { NavLink, useHistory, useParams } from 'react-router-dom'
import { AdaptivGrid, AdaptivGridItem } from '../../components/adaptivGrid'
import { Loader } from '../../components/Loader'
import { useDeviceOptions } from '../../hooks/deviceOption.hook'
import { useHttp } from '../../hooks/http.hook'
import { useMessage } from '../../hooks/message.hook'
import { useSocket } from '../../hooks/socket.hook'
import { FieldComponent } from './AddDevicepages/fields/fieldComponent'
import { clear_menu, setDopMenu, setSearch, setTitle } from '../../store/reducers/menuReducer'
import { DeviceCard } from './deviceCard/deviceCard'
import { EditFieldComponent } from './AddDevicepages/fields/editFieldsComponent'

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


export const EditDevicePage = () => {

  	let { systemName } = useParams();
  	const dispatch = useDispatch()
  	const auth = useSelector(state=>state.auth)
  	const {devices} = useSelector(state=>state.socket)
	const {message} = useMessage()
	const {request, error, clearError} = useHttp()
	const read = useRef(0)
	const history = useHistory()
	const [loading, setLoading] = useState(false)
	const {getOptions} = useDeviceOptions()
	const [device, setDevice] = useState({
		class_device: "",
		type: "",
		value_type: "json",
		name: "",
		address: "",
		system_name: "",
		fields: [],
		token: ""
	})

  	const searchDevice = useCallback((systemNameF)=>{
		if(read.current > 2) return;
		let condidat = devices.filter((item)=>item.system_name === systemNameF)
		condidat = condidat[0]
		if(!condidat) return
		setDevice({
			class_device: condidat.class_device,
			type: condidat.type,
			value_type: condidat.value_type,
			name: condidat.name,
			address: condidat.address,
			system_name: condidat.system_name,
			fields: condidat.fields,
			token: condidat.token
		})
		read.current = read.current + 1
		return condidat[0]
	},[devices])

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

	const validFields = (field)=>{
		if (field.type === "")
		  return false
		if (field.name === "")
		  return false
		if (field.low === "" && (field.type === "binary" || field.type === "number"))
		  return false
		if (field.high === "" && (field.type === "binary" || field.type === "number")) 
		  return false
		if (field.enum_values === "" && field.type === "enum") 
		  return false
		if (getOptions(device.class_device).added.address && field.address === "")
		  return false
		return true
	  }
	
	  const valid = ()=>{
		if (device.type === "")
		  return false
		if (device.class_device === "")
		  return false
		if (device.value_type === "")
		  return false
    	if (device.name === "" || device.system_name === "" || device.system_name === "system" || device.system_name === "variable" || device.system_name === "group" || device.system_name === "room" || device.system_name === "device")
		  return false
		if (getOptions(device.class_device).added.address && device.address === "")
		  return false
		if (getOptions(device.class_device).added.token && device.token === "")
		  return false
		for (const item of device.fields) {
		  if (!validFields(item)) return false
		}
		return true
	  }
	
	  const out = async()=>{
		if(valid())
		{
			console.log("p0")
			try{
			let data = await request(`/api/devices/${systemName}`, "PUT", device, {Authorization: `Bearer ${auth.token}`})
			if(data)
			{
				history.push("/devices")
			}
		  }
		  catch{}
		}
		else
		  message("invalid entered data", 'error');
	  }

	useEffect(()=>{
		dispatch(setTitle("Edit devices"))
		return ()=>dispatch(clear_menu())
  	},[dispatch])

	useEffect(()=>{
		searchDevice(systemName)
	},[systemName, searchDevice])

	useEffect(()=>{
		message(error, 'error');
		clearError();
		return ()=>clearError()
	},[error, message, clearError])

	if (!device.class_device)
		return <Loader/>

	if(loading)
		return(<Loader/>)

  return(
	<div className='container normal-color'>
		<div className='pagecontent card-container'>
			<h2>Edit Device</h2>
			<div className="configElement">
				<div className="input-data">
					<input onChange={changeHandler} required name="name" type="text" value={device.name}></input>
					<label>name</label>
				</div>
			</div>
			<div className="configElement">
				<div className="input-data">
					<input onChange={changeHandler} required name="system_name" type="text" value={device.system_name}></input>
					<label>system name</label>
				</div>
			</div>
			{
			(getOptions(device.class_device)?.change.address)?
			<div className="configElement">
				<div className="input-data">
					<input onChange={changeHandler} required name="address" type="text" value={device.address}></input>
					<label>address</label>
				</div>
			</div>:
			null
			}
			{
			(getOptions(device.class_device)?.change.token)?
			<div className="configElement">
				<div className="input-data">
					<input onChange={changeHandler} required name="token" type="text" value={device.token}></input>
					<label>token</label>
				</div>
			</div>:
			null
			}
			{
			(getOptions(device.class_device)?.change.address)?
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
				device?.fields.map(
					(item, index)=><EditFieldComponent 
					del={()=>delField(index)} 
					setField={(data)=>setField(data, index)} 
					options={getOptions(device.class_device)?.change.fields} 
					key={index} 
					field={item}
					/>)
			}
			<div className="card-btn-container">
				{
					(getOptions(device.class_device)?.change.fields.added)?
					<button className='btn' onClick={addField}>add field</button>:
					null
				}
				<button className='btn' onClick={out}>save</button>
			</div>
		</div>
	</div>
  )
}
