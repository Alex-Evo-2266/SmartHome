import React,{useCallback,useEffect} from 'react'
import { NavLink, useHistory, useParams } from 'react-router-dom'
import { BaseCard } from '../../../components/cards/baseCard'
import { DopMenu } from '../../../components/contextMenu/dopMenu'
import { DeviceField } from './fieldCard/baseField'

export const DeviceCard = ({user,updata, device})=>{

	const history = useHistory()
	
	const getValue = (values, field)=>{
		if (field.name in values)
			return values[field.name]
		return field.low
	}

	const getButtons = [
		{
			title:"edit",
			onClick: ()=>{
				history.push("/devices/edit/" + device.system_name)
			},
		},
		{
			title:"delete",
			onClick: ()=>{},
		},
	]

	return(
		<BaseCard className="device-card">
			<DopMenu buttons={getButtons} style={{right: "0"}}/>
			<div className='card-content'>
				<h2>{device.name}</h2>
				<p>system name: {device.system_name}</p>
				<p>type: {device.type}</p>
			</div>
			<div className='dividers'></div>
			<div className='card-content'>
			{
				device?.fields?.map((item, index)=>(
					<DeviceField key={index} field={item} value={getValue(device.value, item)} systemName={device.system_name}/>
				))
			}
			</div>
			<div className='card-btn-container'>
			</div>
			

		</BaseCard>
	)
}
