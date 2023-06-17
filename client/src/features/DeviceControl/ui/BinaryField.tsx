


import React,{useCallback,useEffect, useState} from 'react'
import { useControlDeviceAPI } from '../api/setDeviceValue'
import { FieldDevice } from '../../../entites/Device'
import { Switch } from '../../../shared/ui'

interface FieldProps{
	field: FieldDevice
	value: string
	systemName: string
}

export const BinaryField = ({field, value, systemName}:FieldProps)=>{
	const [v, setV] = useState<boolean>(false)
	const {setValueDevice} = useControlDeviceAPI()

	useEffect(()=>{
		if(field.high === String(value))
			setV(true)
		else
			setV(false)
	},[value])

	const out = useCallback((e:React.ChangeEvent<HTMLInputElement>)=>{
		let newV = field.low
		if(e.target.checked)
			newV = field.high
		setV(e.target.checked)
		setValueDevice(systemName, field.name, newV)
	},[setValueDevice, systemName, field])

	return(
		<div className='device-field'>
			<div className='device-field-title'>
			{field.name}
			</div>
			<div className='device-field-control'>
				<Switch checked={v} onChange={out}/>
			</div>
		</div>
	)
}

