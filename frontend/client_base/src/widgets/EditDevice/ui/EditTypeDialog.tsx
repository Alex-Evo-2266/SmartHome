import { ArrowRight, Button, FullScreenTemplateDialog, TextField } from "alex-evo-sh-ui-kit"
import { useCallback, useState } from "react"
import { DeviceClassOptions, DeviceSchema } from "../../../entites/devices"
import { SelectField } from "../../../shared"
import { DeviceType, DeviceTypeEditData } from "../models/type"
import { getFieldMap, getFieldsCondidat, getFieldType, getType } from "../helpers/filterFields"
import { editField } from "../helpers/fieldTypeEdit"
import { TypeDevice } from "../../../entites/devices/models/type"
import { useTypeDeviceAPI } from "../api/types"


interface BaseProps {
  onHide: () => void;
  option: DeviceClassOptions;
  data: DeviceSchema;
  types: DeviceType[];
}

interface WithType extends BaseProps {
  type: TypeDevice;
  onSave: (data: DeviceTypeEditData | null, id: string) => void;
  onHideAndLoad: () => void;
}

interface WithoutType extends BaseProps {
	type?: undefined
  	onSave: (data: DeviceTypeEditData) => void;
  	onHideAndLoad?: undefined
}

type TypeDataProps = WithType | WithoutType;

export const EditTypeDialog:React.FC<TypeDataProps> = ({onHide, onSave, option, data, types, type, onHideAndLoad}) => {
	const [typeMap, setTypeMap] = useState<DeviceTypeEditData | null>(getType(type))
	const {setTypeMain} = useTypeDeviceAPI()

	const save = useCallback(()=>{
		if(type)
			onSave(typeMap, type?.id)
		else if(typeMap)
			onSave(typeMap)
	},[typeMap, type])

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
		const availableTypes = types.filter(item=>(!option.available_types || option.available_types.includes(item.name))).map(item=>({title: item.name, value: item.name}))
		availableTypes.push({title: "[]", value: ""})
		return availableTypes
	}

	const changeField = useCallback((id:string, name: string, types:DeviceType[])=>{
		setTypeMap(prev=>{
			if(!prev) return null
			return{...prev, fields:editField(prev?.fields.slice(), name, id, types, prev.name_type)}
		})
	},[])

	const setMain = useCallback(async()=>{
		if(type?.id){
			await setTypeMain(data.system_name, type.id)
			onHideAndLoad && onHideAndLoad()
		}
	},[onHideAndLoad, setTypeMain, data.system_name, type])

	return(
		<FullScreenTemplateDialog header="Type" onHide={onHide} onSave={save}>
			<div style={{marginInline: '16px'}}>
				<SelectField border items={getAvailableTypes(option, types)} value={typeMap?.name_type ?? ""} onChange={changeType}/>
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
				{
					type?.id && <Button onClick={setMain}>set main</Button>
				}
			</div>
		</FullScreenTemplateDialog>
	)
}