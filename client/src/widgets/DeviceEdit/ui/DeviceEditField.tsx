import { useState, useCallback } from "react"
import { DeviceFieldType, FieldDevice } from "../../../entites/Device/models/deviceData"
import { DeviceOption } from "../../../features/DeviceOption"
import { SelectIconField } from "../../../features/IconSelect"
import { splitValue } from "../../../shared/lib/helpers/stringSplitAndJoin"
import { useAppDispatch } from "../../../shared/lib/hooks/redux"
import { hideDialog, hideFullScreenDialog, showDialog, showFullScreenDialog } from "../../../shared/lib/reducers/dialogReducer"
import { BaseDialog, Divider, FieldContainer, FullScrinTemplateDialog, SelectField, TextField } from "../../../shared/ui"
import { MoreText } from "../../../shared/ui/MoreText/MoreText"
import { DeviceEditAddField } from "./DeviceEditAddFieldDialog"
import { EntitiesField } from "../../../features/EntityField/ui/EntityField"

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
		setField(prev=>({...prev, read_only: (value==="true")}))
	}

	const changeIcon = (value: string) => {
		setField(prev=>({...prev, icon: value}))
	}

	const changeType = useCallback((value: string) => {
		let old = field.type
		if (value === DeviceFieldType.BINARY || value === DeviceFieldType.ENUM || value === DeviceFieldType.NUMBER || value === DeviceFieldType.TEXT)
		{
			console.log(field.entity, field.entity !== "")
			if(field.entity !== "")
				dispatch(showDialog(<BaseDialog 
					header="confirmation" 
					text='if you change this field, the "entity" field will be cleared.' 
					onHide={()=>dispatch(hideDialog())} 
					onCancel={()=>setField(prev=>({...prev, type: old}))}
					onSuccess={()=>{
					setField(prev=>({...prev, type: value, entity: ""}))
				}}/>))
			else
				setField(prev=>({...prev, type: value}))
		}
	},[field])

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
					(prop.option.change.fields.icon)?
					<FieldContainer header="icon">
						<SelectIconField border value={field.icon} onChange={(data)=>changeIcon(data)}/>
					</FieldContainer>:
					null
				}
				{
					(prop.option.change.fields.address && !field.virtual_field)?
					<FieldContainer header="Address">
						<TextField border value={field.address} name="address" onChange={(e)=>changeValue(e)}/>
					</FieldContainer>:
					null
				}
				{
					(prop.option.change.fields.type)?
					<FieldContainer header="Type">
						<SelectField items={["text", "number", "enum", "binary"]} border value={field.type} name="type" onChange={changeType}/>
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
						<SelectField items={[{title: "read only", value: "false"}, {title: "control", value: "true"}]} border value={String(field.read_only)} name="type" onChange={(value)=>changeControl(value)}/>
					</FieldContainer>:
					null
				}

				{
						(prop.option.change.fields.enum_values && field.type === DeviceFieldType.ENUM)?
						<>
						<FieldContainer header="Enum values">
							<MoreText border value={field.enum_values} onChange={(e)=>changeSelect(e, "enum_values")}/>
						</FieldContainer>
						</>:
						null
					}
					{
						(field.virtual_field)?
						<FieldContainer header="entity">
							<EntitiesField value={field.entity.split(",").map(item=>item.trim()).filter(item=>item!=="")} onChange={(data)=>changeSelect(data.join(", "), "entity")}/>
						</FieldContainer>:
						null
					}
					{
						(prop.option.change.fields.value && field.virtual_field && !field.read_only)?
						<FieldContainer header="value">
							не реализованно
						</FieldContainer>:
						(prop.option.change.fields.value && field.type === DeviceFieldType.ENUM)?
						<FieldContainer header="value">
							<SelectField items={splitValue(field.enum_values)} border value={field.value} name="value" onChange={(value)=>changeSelect(value, "value")}/>
						</FieldContainer>:
						(prop.option.change.fields.value && field.type === DeviceFieldType.NUMBER)?
						<FieldContainer header="value">
							<TextField type="number" border value={field.value} name="value" onChange={(e)=>changeValue(e)}/>
						</FieldContainer>:
						(prop.option.change.fields.value)?
						<FieldContainer header="value">
							<TextField type="test" border value={field.value} name="value" onChange={(e)=>changeValue(e)}/>
						</FieldContainer>:null
					}
				<Divider/>
				</div>
		</FullScrinTemplateDialog>
	)
}