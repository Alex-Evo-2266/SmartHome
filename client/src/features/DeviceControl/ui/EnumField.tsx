import {useCallback,useEffect, useState} from 'react'
import { useControlDeviceAPI } from '../api/setDeviceValue'
import { SelectField } from '../../../shared/ui'
import { FieldDevice } from '../../../entites/Device'
import { splitValue } from '../../../shared/lib/helpers/stringSplitAndJoin'

interface FieldProps{
	field: FieldDevice
	value: string
	systemName: string
}

export const EnumField = ({field, value, systemName}:FieldProps)=>{
	const [v, setV] = useState<string>('')
	const {setValueDevice} = useControlDeviceAPI()

	useEffect(()=>{
		setV(value)
	},[value])

	const out = useCallback((value: string)=>{
		setV(value)
		setValueDevice(systemName, field.name, value)
	},[systemName, field, setValueDevice])

	return(
		<div className='device-field'>
			<div className='device-field-title'>
			{field.name}
			</div>
			<div className='device-field-control input-data'>
				<SelectField placeholder='select value' className='bg-transparent device-field-control-text-input' items={splitValue(field.enum_values)} onChange={out} value={v}/>
			</div>
		</div>
	)
}

