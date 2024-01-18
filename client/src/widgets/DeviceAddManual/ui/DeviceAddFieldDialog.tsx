import { useState, useCallback } from "react"
import { DeviceFieldType, FieldDevice } from "../../../entites/Device/models/deviceData"
import { DeviceOption } from "../../../features/DeviceOption"
import { SelectIconField } from "../../../features/IconSelect"
import { splitValue } from "../../../shared/lib/helpers/stringSplitAndJoin"
import { useAppDispatch } from "../../../shared/lib/hooks/redux"
import { hideDialog, hideFullScreenDialog, showDialog } from "../../../shared/lib/reducers/dialogReducer"
import { BaseDialog, Divider, FieldContainer, FullScrinTemplateDialog, SelectField, TextField } from "../../../shared/ui"
import { MoreText } from "../../../shared/ui/MoreText/MoreText"
import { useSnackbar } from "../../../shared/lib/hooks/snackbar.hook"
import { EntitiesField } from "../../../features/EntityField/ui/EntityField"

interface DeviceEditFieldProps{
	field: FieldDevice
	option: DeviceOption
	setField: (value:FieldDevice)=>void
}

export const DeviceAddField = (prop:DeviceEditFieldProps) => {

	const dispatch = useAppDispatch()
	const {showSnackbar} = useSnackbar()
	const [field, setField] = useState<FieldDevice>(prop.field)

	const changeValue = (event:React.ChangeEvent<HTMLInputElement>) => {
		setField(prev=>({...prev, [event.target.name]: event.target.value}))
	}

	const changeSelect = (value: string, name:string) => {
		console.log(value, name)
		setField(prev=>({...prev, [name]: value}))
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

	const changeBoolAtribut = (name:string, value: string) => {
		setField(prev=>({...prev, [name]: (value==="true")}))
	}

	const changeIcon = (value: string) => {
		setField(prev=>({...prev, icon: value}))
	}

	const validData = useCallback(()=>{
		if(field.name === "" || field.name === null || field.name === undefined)
			return false
		return true
	},[field])

	const save = useCallback(() => {
		if (!validData())
		{
			showSnackbar("invalid data", {}, 10000)
			return
		}
		prop.setField && prop.setField(field)
		dispatch(hideFullScreenDialog())
	},[validData, showSnackbar, field])


	return(
		<FullScrinTemplateDialog onSave={save} onHide={()=>dispatch(hideFullScreenDialog())}>
			<h3 className="device-edit-fields">Field</h3>
			<div className="field-device">
					<FieldContainer header="Name">
						<TextField border value={field.name} name="name" onChange={(e)=>changeValue(e)}/>
					</FieldContainer>
					<FieldContainer header="icons">
						<SelectIconField border value={field.icon} onChange={(data)=>changeIcon(data)}/>
					</FieldContainer>
					<FieldContainer header="Virtual field">
						<SelectField items={[{title: "flase", value: "false"}, {title: "true", value: "true"}]} border value={String(field.virtual_field)} name="virtual" onChange={(value)=>changeBoolAtribut("virtual_field", value)}/>
					</FieldContainer>
					{
						(!field.virtual_field)?
						<FieldContainer header="Address">
							<TextField border value={field.address} name="address" onChange={(e)=>changeValue(e)}/>
						</FieldContainer>:null
					}
					<FieldContainer header="Type">
						<SelectField items={["text", "number", "enum", "binary"]} border value={field.type} name="type" onChange={changeType}/>
					</FieldContainer>
					{
						(field.type === "number" || field.type === "binary")?
						<>
						<FieldContainer header="High value">
							<TextField border value={field.high} type="number" name="high" onChange={(e)=>changeValue(e)}/>
						</FieldContainer>
						<FieldContainer header="Low value">
							<TextField border value={field.low} type="number" name="low" onChange={(e)=>changeValue(e)}/>
						</FieldContainer>
						</>:
						null
					}
					<FieldContainer header="Unit">
						<TextField border value={field.unit} name="unit" onChange={(e)=>changeValue(e)}/>
					</FieldContainer>
					<FieldContainer header="Read only">
						<SelectField items={[{title: "read only", value: "false"}, {title: "control", value: "true"}]} border value={String(field.read_only)} name="Control" onChange={(value)=>changeBoolAtribut("read_only", value)}/>
					</FieldContainer>
					{
						(field.type === "enum")?
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
							<EntitiesField type={field.type} value={field.entity.split(",").map(item=>item.trim()).filter(item=>item!=="")} onChange={(data)=>changeSelect(data.join(", "), "entity")}/>
						</FieldContainer>:
						null
					}
					{
						(field.virtual_field && !field.read_only)?
						<FieldContainer header="value">
							не реализованно
						</FieldContainer>:
						(field.type === "enum")?
						<FieldContainer header="value">
							<SelectField items={splitValue(field.enum_values)} border value={field.value} name="value" onChange={(value)=>changeSelect(value, "value")}/>
						</FieldContainer>:
						(field.type === "number")?
						<FieldContainer header="value">
							<TextField type="number" border value={field.value} name="value" onChange={(e)=>changeValue(e)}/>
						</FieldContainer>:
						<FieldContainer header="value">
							<TextField type="test" border value={field.value} name="value" onChange={(e)=>changeValue(e)}/>
						</FieldContainer>
					}
				</div>
		</FullScrinTemplateDialog>
	)
}