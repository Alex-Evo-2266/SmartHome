
import './DeviceControl.scss'
import { BinaryField } from './BinaryField'
import { EnumField } from './EnumField'
import { NumberField } from './NumberField'
import { TextFieldControl } from './TextField'
import { FieldDevice } from '../../../entites/Device'
import { DeviceFieldType } from '../../../entites/Device/models/deviceData'
import { DefaultFieldControl } from './DeviceDefaultField'

interface FieldProps{
	field: FieldDevice
	value: string
	systemName: string
	
}

export const DeviceField = ({field, value, systemName}:FieldProps)=>{
	if (field.type === DeviceFieldType.NUMBER)
		return <NumberField field={field} value={value} systemName={systemName}/>
	if (field.type === DeviceFieldType.BINARY)
		return <BinaryField field={field} value={value} systemName={systemName}/>
	if (field.type === DeviceFieldType.ENUM)
		return <EnumField field={field} value={value} systemName={systemName}/>
	if (field.type === DeviceFieldType.TEXT)
		return <TextFieldControl field={field} value={value} systemName={systemName}/>
	return <DefaultFieldControl value={value}/>
}
