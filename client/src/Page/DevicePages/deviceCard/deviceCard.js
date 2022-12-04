import React,{useCallback,useEffect} from 'react'
import { NavLink } from 'react-router-dom'
import { BaseCard } from '../../../components/cards/baseCard'
import { DeviceField } from './fieldCard/baseField'

export const DeviceCard = ({user,updata, device})=>{
	
	const getValue = (values, field)=>{
		if (field.name in values)
			return values[field.name]
		return field.low
	}

	return(
		<BaseCard>
			<div className='card-content'>
				<h2>{device.name}</h2>
				<p>system name: {device.system_name}</p>
				<p>type: {device.type}</p>
			</div>
			<div className='dividers'></div>
			<div className='card-content'>
			{
				device?.fields?.map((item, index)=>(
					<DeviceField key={index} field={item} value={getValue(device.value, item)}/>
				))
			}
			</div>
			<div className='card-btn-container'>
			</div>
			

		</BaseCard>
	)
}
