

import {useCallback,useEffect, useState} from 'react'
import { useControlDeviceAPI } from '../api/setDeviceValue'
import { FieldDevice } from '../../../entites/Device'
import { Button, IconButton, TextField } from "alex-evo-sh-ui-kit"
import { Send } from 'lucide-react'

interface FieldProps{
	field: FieldDevice
	value: string
	systemName: string
}

export const TextFieldControl = ({field, value, systemName}:FieldProps)=>{
	const [v, setV] = useState<string>("")
	const {setValueDevice} = useControlDeviceAPI()

	useEffect(()=>{
		setV(value)
	},[value])

	const out = useCallback(()=>{
		setValueDevice(systemName, field.name, v)
	},[setValueDevice, systemName, field, v])

	return(
		<div className='device-field'>
			<div className='device-field-title'>
			{field.name}
			</div>
			<div className='device-field-control device-field-control-text'>
				<TextField onChange={(e)=>setV(e.target.value)} value={v} className='bg-transparent device-field-control-text-input'/>
				<IconButton icon={<Send/>} onClick={out}/>
			</div>
		</div>
	)
}

