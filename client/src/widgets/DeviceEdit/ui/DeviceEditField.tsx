import { useState } from "react"
import { DeviceFieldType, FieldDevice } from "../../../entites/Device/models/deviceData"
import { DeviceOption } from "../../../features/DeviceOption"
import { SelectIconField } from "../../../features/IconSelect"
import { splitValue } from "../../../shared/lib/helpers/stringSplitAndJoin"
import { useAppDispatch } from "../../../shared/lib/hooks/redux"
import { hideFullScreenDialog } from "../../../shared/lib/reducers/dialogReducer"
import { Divider, FieldContainer, FullScrinTemplateDialog, SelectField, TextField } from "../../../shared/ui"
import { MoreText } from "../../../shared/ui/MoreText/MoreText"

interface DeviceEditFieldProps{
	field: FieldDevice
	option: DeviceOption
	setField: (value:FieldDevice)=>void
}

export const DeviceEditField = (prop:DeviceEditFieldProps) => {

	const dispatch = useAppDispatch()
	const [field, setField] = useState<FieldDevice>(prop.field)

	const changeValue = (event:React.ChangeEvent<HTMLInputElement>) => {
		setField(prev=>({...prev, [event.target.name]: event.target.value}))
	}

	const changeSelect = (value: string, name:string) => {
		setField(prev=>({...prev, [name]: value}))
	}

	const changeControl = (value: string) => {
		setField(prev=>({...prev, control: (value==="true")}))
	}

	const changeIcon = (value: string) => {
		setField(prev=>({...prev, icon: value}))
	}

	const save = () => {
		prop.setField && prop.setField(field)
		dispatch(hideFullScreenDialog())
	}

	return(
		<FullScrinTemplateDialog onSave={save} onHide={()=>dispatch(hideFullScreenDialog())}>
		<h3 className="device-edit-fields">Field</h3>
		<div className="field-device">
				{
					(!prop.option.change.fields.name)?
					<h4>Name: {field.name}</h4>:
					<FieldContainer header="Name">
						<TextField border value={field.name} name="name" onChange={(e)=>changeValue(e)}/>
					</FieldContainer>
				}
				{
					(prop.option.change.fields.address)?
					<FieldContainer header="Address">
						<TextField border value={field.address} name="address" onChange={(e)=>changeValue(e)}/>
					</FieldContainer>:
					null
				}
				{
					(prop.option.change.fields.type)?
					<FieldContainer header="Type">
						<SelectField items={["text", "number", "enum", "binary"]} border value={field.type} name="type" onChange={(value)=>changeSelect(value, "type")}/>
					</FieldContainer>:
					null
				}
				{
					(prop.option.change.fields.high && (field.type === DeviceFieldType.BINARY || field.type === DeviceFieldType.NUMBER))?
					<FieldContainer header="High value">
						<TextField border value={field.high} type="number" name="high" onChange={(e)=>changeValue(e)}/>
					</FieldContainer>:
					null
				}
				{
					(prop.option.change.fields.low && (field.type === DeviceFieldType.BINARY || field.type === DeviceFieldType.NUMBER))?
					<FieldContainer header="Low value">
						<TextField border value={field.low} type="number" name="low" onChange={(e)=>changeValue(e)}/>
					</FieldContainer>:
					null
				}
				{
					(prop.option.change.fields.unit && (field.type === DeviceFieldType.NUMBER))?
					<FieldContainer header="Unit">
						<TextField border value={field.unit} name="unit" onChange={(e)=>changeValue(e)}/>
					</FieldContainer>:
					null
				}
				{
					(prop.option.change.fields.control)?
					<FieldContainer header="Control">
						<SelectField items={[{title: "read only", value: "false"}, {title: "control", value: "true"}]} border value={String(field.control)} name="type" onChange={(value)=>changeControl(value)}/>
					</FieldContainer>:
					null
				}
				{
					(prop.option.change.fields.enum_values && field.type === DeviceFieldType.ENUM)?
					<FieldContainer header="Enum values">
						<MoreText border value={field.enum_values} onChange={(e)=>changeSelect(e, "enum_values")}/>
					</FieldContainer>:
					null
				}
				{
					(prop.option.change.fields.value && field.type === DeviceFieldType.ENUM)?
					<FieldContainer header="values">
						<SelectField items={splitValue(field.enum_values)} border value={field.value} name="value" onChange={(value)=>changeSelect(value, "value")}/>
					</FieldContainer>:
					(prop.option.change.fields.value)?
					<FieldContainer header="values">
						<TextField border value={field.value} name="value" onChange={(e)=>changeValue(e)}/>
					</FieldContainer>:
					null
				}
				{
					(prop.option.change.fields.icon)?
					<SelectIconField value={field.icon} onChange={(data)=>changeIcon(data)}/>:
					null
				}
				<Divider/>
				</div>
		</FullScrinTemplateDialog>
	)
}