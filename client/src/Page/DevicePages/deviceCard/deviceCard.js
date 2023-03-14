import React,{useCallback,useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { NavLink, useHistory, useParams } from 'react-router-dom'
import { SUCCESS } from '../../../components/alerts/alertTyps'
import { BaseCard } from '../../../components/cards/baseCard'
import { DopMenu } from '../../../components/contextMenu/dopMenu'
import { RunText } from '../../../components/runText'
import { useHttp } from '../../../hooks/http.hook'
import { useMessage } from '../../../hooks/message.hook'
import { hideDialog, showAlertDialog } from '../../../store/reducers/dialogReducer'
import { DeviceField } from './fieldCard/baseField'

export const DeviceCard = ({user,updata, device})=>{

	const history = useHistory()
	const {message} = useMessage()
	const {request, error, clearError} = useHttp()
	const auth = useSelector(state=>state.auth)
	const dispatch = useDispatch()
	
	const getValue = (values, field)=>{
		if (field.name in values)
			return values[field.name]
		return field.low
	}

	const deleteDevice = async()=>{
		try{
			dispatch(showAlertDialog("delete device", "delete device?", [
				{
					title:"ok", 
					action:async()=>{
						let data = await request(
											`/api/devices/${device.system_name}`, 
											"DELETE", 
											null, 
											{Authorization: `Bearer ${auth.token}`
										})
						if (data)
							message("device deleted", SUCCESS);
				}},
				{
					title:"cancel",
					action:()=>dispatch(hideDialog())
				}
			]))
		}catch{
			dispatch(hideDialog())
		}
	}

	const getButtons = ()=>{
		let btns = [
			{
				title:"edit",
				onClick: ()=>{
					history.push("/devices/edit/" + device.system_name)
				},
			}
		]
		if (device.status === "unlinc"){
			btns.push({
				title: "connect",
				onClick: ()=>request(`/api/devices/${device.system_name}/connection`,"POST", {status: true}, {Authorization: `Bearer ${auth.token}`})
			})
		}
		else{
			btns.push({
				title: "disabling",
				onClick: ()=>request(`/api/devices/${device.system_name}/connection`,"POST", {status: false}, {Authorization: `Bearer ${auth.token}`})
			})
		}
		btns.push(
		{
			title:"delete",
			onClick: deleteDevice,
		})
		return (btns)
	}

	useEffect(()=>{
		message(error, 'error');
		clearError();
		return ()=>clearError()
	},[error, message, clearError])

	return(
		<BaseCard className="device-card">
			<DopMenu buttons={getButtons()} style={{right: "0"}}/>
			<div className='card-content'>
				<div className={`device-module-name-container ${device.class_device}`}>
					<p className={`device-module-name ${device.class_device}`}>{device.class_device}</p>
				</div>
				<div className='device-card-title'>
					<RunText text={device.name} id={device.system_name}/>
				</div>
				<p>system name: {device.system_name}</p>
				<p>type: {device.type}</p>
			</div>
			<div className='dividers'></div>
			<div className='card-content'>
			{
				(device.status === "online")?
				device?.fields?.map((item, index)=>(
					<DeviceField key={index} field={item} value={getValue(device.value, item)} systemName={device.system_name}/>
				)):
				<p>{device.status}</p>
			}
			</div>
			<div className='card-btn-container'>
			</div>
			

		</BaseCard>
	)
}
