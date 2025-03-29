import { ArrowRight, FullScrinTemplateDialog, TextField } from "alex-evo-sh-ui-kit"
import { useCallback, useState } from "react"
import { DeviceClassOptions, DeviceSchema } from "../../../entites/devices"
import { SelectField } from "../../../shared"
import { DeviceType, DeviceTypeEditData } from "../models/type"
import { getFieldMap, getFieldsCondidat, getFieldType, getType } from "../helpers/filterFields"
import { editField } from "../helpers/fieldTypeEdit"


interface TypeDataProps{
	onHide: ()=>void
	onSave: (data: DeviceTypeEditData | null)=>void
	option: DeviceClassOptions
	data: DeviceSchema
	types: DeviceType[]
}

export const EditTypeDialog:React.FC<TypeDataProps> = ({onHide, onSave, option, data, types}) => {
	const [typeMap, setTypeMap] = useState<DeviceTypeEditData | null>(getType(data.type_mask))

	const save = useCallback(()=>{
		onSave(typeMap)
	},[typeMap])

	const changeType = useCallback((newValue: string) => {
		if(newValue === ""){
			setTypeMap(null)
		}
		else{
			setTypeMap({
				device:data.system_name,
				name_type: newValue,
				fields:[]
			})
		}
	},[data])

	function getAvailableTypes(option: DeviceClassOptions, types: DeviceType[]){
		return types.filter(item=>(!option.available_types || option.available_types.includes(item.name))).map(item=>item.name)
	}

	const changeField = useCallback((id:string, name: string, types:DeviceType[])=>{
		setTypeMap(prev=>{
			if(!prev) return null
			return{...prev, fields:editField(prev?.fields.slice(), name, id, types, prev.name_type)}
		})
	},[])

	return(
		<FullScrinTemplateDialog header="Type" onHide={onHide} onSave={save}>
			<div style={{marginInline: '16px'}}>
				<SelectField border items={["[]", ...getAvailableTypes(option, types)]} value={typeMap?.name_type ?? "[]"} onChange={changeType}/>
				{
					typeMap &&
					<>
						<div className="device-type-field-map">
							<TextField readOnly value="type"/><ArrowRight/><TextField readOnly value="device"/>
						</div>
						{
							getFieldType(types, typeMap.name_type).map((item, index)=>(
								<div className="device-type-field-map" key={`field-maps-${index}`}>
									<TextField readOnly border value={item.name_field_type}/><ArrowRight/><SelectField onChange={(value)=>changeField(value, item.name_field_type, types)} items={getFieldsCondidat(item.type_field, data)} border value={getFieldMap(typeMap, item.name_field_type, data)}/>
								</div>
							))
						}
					</>
				}
			</div>
		</FullScrinTemplateDialog>
	)
}