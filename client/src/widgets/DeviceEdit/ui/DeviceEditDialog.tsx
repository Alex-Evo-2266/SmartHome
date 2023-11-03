import './DeviceEditDialog.scss'
import { useCallback, useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../../shared/lib/hooks/redux"
import { hideDialog, hideFullScreenDialog, showDialog, showFullScreenDialog } from "../../../shared/lib/reducers/dialogReducer"
import { BaseDialog, Divider, FullScrinTemplateDialog, ListContainer, ListItem } from "../../../shared/ui"
import { DeviceData, findDevice } from "../../../entites/Device"
import { DeviceEditBaseData } from "./DeviceEditBaseData"
import { DeviceEditField } from "./DeviceEditField"
import { UseEditDevice } from '../api/putDevice'
import { Trash2 } from 'lucide-react'
import { DeviceFieldType, FieldDevice } from '../../../entites/Device/models/deviceData'

interface DeviceEditDialogProps{
	systemName: string 
}

export const DeviceEditDialog = ({systemName}:DeviceEditDialogProps) => {

	const {devices} = useAppSelector(state=>state.device)
	const deviceOptions = useAppSelector(state=>state.deviceOptions)
	const [device, setDevice] = useState<DeviceData | null>(findDevice(devices, systemName))
	const dispatch = useAppDispatch()
	const {editDevice} = UseEditDevice()

	const getOption = useCallback(()=>{
		let option = deviceOptions.deviceOption.filter(item => item.class_name == device?.class_device)
		return option[0]
	},[device])

	const hide = () => {
		dispatch(hideFullScreenDialog())
	}

	const changeDevice = (value:React.SetStateAction<DeviceData | null>) => {
		setDevice(value)
	}

	const changeField = (field: FieldDevice, index: number) => {
		setDevice(prev=>{
			if(!prev)
				return prev
			else{
				let fields = prev.fields.slice()
				fields[index] = field
				return {...prev, fields}
			}
		})
	}

	const save = useCallback(() => {
		if(!device)
			return
		editDevice(device, systemName)
		hide()
	},[editDevice, systemName, device])

	const showEditFieldDialog = useCallback((index:number) => {
		if(!device)
			return
		dispatch(showFullScreenDialog(<DeviceEditField field={device.fields[index]} option={getOption()} setField={(field)=>changeField(field, index)}/>))
	},[dispatch, device])

	const deleteField = useCallback((id:number) => {
		setDevice(prev=>{
			if(!prev)
				return prev
			else{
				let fields = prev.fields.filter((_,index)=>index !== id)
				return {...prev, fields}
			}
		})
	},[setDevice])

	const deleteFieldDialog = useCallback((id: number) => {
		dispatch(showDialog(<BaseDialog 
			actionText='delete' 
			header='delete field' 
			text='are you sure you want to delete the field.' 
			onHide={()=>dispatch(hideDialog())}
			onSuccess={()=>deleteField(id)}
		/>))
	},[dispatch, deleteField])

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
		<FullScrinTemplateDialog onHide={hide} header={`Edit ${device?.name}`} onSave={save}>
			<div className="device-edit-container">
				<div className="base-data">
					<div>
						<p>Device type: {device?.type}</p>
						<p>Device class: {device?.class_device}</p>
					</div>
				</div>
				<div className="device-edit-body">
				{
					(device && getOption())?
					<>
						<DeviceEditBaseData device={device} option={getOption()} setDevice={changeDevice}/>
						<Divider/>
						<h3 className='device-edit-fields'>Fields</h3>
						<ListContainer transparent>
							{
								device.fields.map((item, index)=>(
									<ListItem 
									key={index} 
									header={item.name} 
									text={`type: ${item.type}`} 
									hovered 
									onClick={()=>showEditFieldDialog(index)}
									control={(getOption().change.fields.deleted)?<Trash2 color='var(--Error-color)' onClick={()=>deleteFieldDialog(index)}/>:null}
									/>
								))
							}
						</ListContainer>
					</>:
					null
				}
				</div>
			</div>
		</FullScrinTemplateDialog>
	)
}