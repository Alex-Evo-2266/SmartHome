

import React,{useCallback,useEffect} from 'react'
import { BinaryField } from './binaryField'
import { EnumField } from './EnumField'
import { NumberField } from './numberField'
import { TextField } from './textField'

export const DeviceField = ({field, value, systemName})=>{
	if (field.type === "number")
		return <NumberField field={field} value={value} systemName={systemName}/>
	if (field.type === "binary")
		return <BinaryField field={field} value={value} systemName={systemName}/>
	if (field.type === "enum")
		return <EnumField field={field} value={value} systemName={systemName}/>
	if (field.type === "text")
		return <TextField field={field} value={value} systemName={systemName}/>

	return null
}
