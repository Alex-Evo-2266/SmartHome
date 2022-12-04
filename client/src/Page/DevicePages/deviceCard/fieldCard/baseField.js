

import React,{useCallback,useEffect} from 'react'
import { BinaryField } from './binaryField'
import { NumberField } from './numberField'

export const DeviceField = ({field, value, systemName})=>{
	if (field.type==="number")
		return <NumberField field={field} value={value} systemName={systemName}/>
	if (field.type==="binary")
		return <BinaryField field={field} value={value} systemName={systemName}/>

	return null
}
