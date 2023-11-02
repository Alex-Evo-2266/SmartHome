

import React,{useCallback,useEffect, useState} from 'react'
import { useControlDeviceAPI } from '../api/setDeviceValue'
import { FieldDevice } from '../../../entites/Device'
import { Slider } from '../../../shared/ui/Slider/Slider'

interface FieldProps{
	field: FieldDevice
	value: string
	systemName: string
}

export const NumberField = ({field, value, systemName}:FieldProps)=>{
	const [v, setV] = useState<number>(0)
	const {setValueDevice} = useControlDeviceAPI()

	useEffect(()=>{
		setV(Number(value))
	},[value])

	const change = useCallback((e:React.ChangeEvent<HTMLInputElement>)=>{
		setV(Number(e.target.value))
	},[systemName, field, setValueDevice])

	const mouseUp = useCallback(() => {
		setValueDevice(systemName, field.name, String(v))
	},[v])

	return(
		<div className='device-field'>
			<div className='device-field-title'>
				{field.name}
			</div>
			<div className='device-field-control slider'>
				<Slider value={Number(v)} onChange={change} onMouseUp={mouseUp} max={Number(field.high)} min={Number(field.low)}/>
			</div>
			<div className='device-field-value'>
				{Number(v)}
			</div>
		</div>
	)
}
