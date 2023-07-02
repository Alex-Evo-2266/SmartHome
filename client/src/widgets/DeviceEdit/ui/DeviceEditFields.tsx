import { DeviceData } from "../../../entites/Device"
import { DeviceFieldType } from "../../../entites/Device/models/deviceData"
import { IDeviceOption } from "../../../features/DeviceOption"
import { splitValue } from "../../../shared/lib/helpers/stringSplitAndJoin"
import { BaseActionCard, Button, Divider, FieldContainer, SelectField, TextField } from "../../../shared/ui"
import { MoreText } from "../../../shared/ui/MoreText/MoreText"

interface DeviceEditFieldProps{
	device: DeviceData
	option: IDeviceOption
	setDevice: (value:React.SetStateAction<DeviceData | null>)=>void
}

export const DeviceEditField = ({device, option, setDevice}:DeviceEditFieldProps) => {

	const changeValue = (event:React.ChangeEvent<HTMLInputElement>, id: number) => {
		setDevice(prev=>{
			if(!prev)
				return prev
			else{
				let fields = prev.fields.slice()
				fields[id] = {...fields[id], [event.target.name]: event.target.value}
				return {...prev, fields}
			}
		})
	}

	const changeSelect = (value: string, name:string, id: number) => {
		setDevice(prev=>{
			if(!prev)
				return prev
			else{
				let fields = prev.fields.slice()
				fields[id] = {...fields[id], [name]: value}
				return {...prev, fields}
			}
		})
	}

	const changeControl = (value: string, id: number) => {
		setDevice(prev=>{
			if(!prev)
				return prev
			else{
				let fields = prev.fields.slice()
				fields[id] = {...fields[id], control: (value==="true")}
				return {...prev, fields}
			}
		})
	}

	const deleteField = (id:number) => {
		setDevice(prev=>{
			if(!prev)
				return prev
			else{
				let fields = prev.fields.filter((_,index)=>index !== id)
				return {...prev, fields}
			}
		})
	}

	const addField = () => {
		setDevice(prev=>{
			if(!prev)
				return prev
			return {...prev, fields: [...prev.fields, {
				name:"",
				type: DeviceFieldType.NUMBER,
				low:"0",
				high:"100",
				unit:"",
				address:"",
				value:"",
				control: true,
				enum_values: "",
				icon: ""
			}]}
		})
	}

	return(
		<>
		<h3 className="device-edit-fields">Fields</h3>
		{
			device.fields.map((item, index) => (
				<div className="field-device" key={index}>
				{
					(!option.change.fields.name)?
					<h4>{item.name}</h4>:
					<FieldContainer header="Name">
						<TextField border value={item.name} name="name" onChange={(e)=>changeValue(e, index)}/>
					</FieldContainer>
				}
				{
					(option.change.fields.address)?
					<FieldContainer header="Address">
						<TextField border value={item.address} name="address" onChange={(e)=>changeValue(e, index)}/>
					</FieldContainer>:
					null
				}
				{
					(option.change.fields.type)?
					<FieldContainer header="Type">
						<SelectField items={["text", "number", "enum", "binary"]} border value={item.type} name="type" onChange={(value)=>changeSelect(value, "type", index)}/>
					</FieldContainer>:
					null
				}
				{
					(option.change.fields.high && (item.type === DeviceFieldType.BINARY || item.type === DeviceFieldType.NUMBER))?
					<FieldContainer header="High value">
						<TextField border value={item.high} type="number" name="high" onChange={(e)=>changeValue(e, index)}/>
					</FieldContainer>:
					null
				}
				{
					(option.change.fields.low && (item.type === DeviceFieldType.BINARY || item.type === DeviceFieldType.NUMBER))?
					<FieldContainer header="Low value">
						<TextField border value={item.low} type="number" name="low" onChange={(e)=>changeValue(e, index)}/>
					</FieldContainer>:
					null
				}
				{
					(option.change.fields.unit && (item.type === DeviceFieldType.NUMBER))?
					<FieldContainer header="Unit">
						<TextField border value={item.unit} name="unit" onChange={(e)=>changeValue(e, index)}/>
					</FieldContainer>:
					null
				}
				{
					(option.change.fields.control)?
					<FieldContainer header="Control">
						<SelectField items={[{title: "read only", value: "false"}, {title: "control", value: "true"}]} border value={String(item.control)} name="type" onChange={(value)=>changeControl(value, index)}/>
					</FieldContainer>:
					null
				}
				{
					(option.change.fields.enumValues && item.type === DeviceFieldType.ENUM)?
					<FieldContainer header="Enum values">
						<MoreText border value={item.enum_values} onChange={(e)=>changeSelect(e, "enum_values", index)}/>
					</FieldContainer>:
					null
				}
				{
					(option.change.fields.value && item.type === DeviceFieldType.ENUM)?
					<FieldContainer header="values">
						<SelectField items={splitValue(item.enum_values)} border value={item.value} name="value" onChange={(value)=>changeSelect(value, "value", index)}/>
					</FieldContainer>:
					(option.change.fields.value)?
					<FieldContainer header="values">
						<TextField border value={item.value} name="value" onChange={(e)=>changeValue(e, index)}/>
					</FieldContainer>:
					null
				}
				{
					(option.change.fields.deleted)?
					<BaseActionCard><Button onClick={()=>deleteField(index)} style={{backgroundColor: "var(--Error-color)", color: "var(--On-error-color)"}}>delete</Button></BaseActionCard>:
					null
				}
				<Divider/>
				</div>
			))
		}
		{
			(option.change.fields.added)?
			<BaseActionCard><Button onClick={()=>addField()}>Add field</Button></BaseActionCard>:
			null
		}
		</>
	)
}