import './DeviceEditDialog.scss'
import { useCallback, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../../shared/lib/hooks/redux"
import { hideDialog, hideFullScreenDialog, showDialog, showFullScreenDialog } from "../../../shared/lib/reducers/dialogReducer"
import { BaseDialog, Divider, FilledButton, FullScrinTemplateDialog, ListContainer, ListItem } from "alex-evo-sh-ui-kit"
import { DeviceData, findDevice } from "../../../entites/Device"
import { DeviceEditBaseData } from "./DeviceEditBaseData"
import { DeviceEditField } from "./DeviceEditField"
import { UseEditDevice } from '../api/apiDevice'
import { Trash2 } from 'lucide-react'
import { DeviceFieldType, FieldDevice } from '../../../entites/Device/models/deviceData'
import { DeviceEditAddField } from './DeviceEditAddFieldDialog'

interface DeviceEditDialogProps{
	systemName: string 
}

export const DeviceEditDialog = ({systemName}:DeviceEditDialogProps) => {

	const {devices} = useAppSelector(state=>state.device)
	const deviceOptions = useAppSelector(state=>state.deviceOptions)
	const [device, setDevice] = useState<DeviceData | null>(findDevice(devices, systemName))
	const dispatch = useAppDispatch()
	const {editDevice, deleteDevice} = UseEditDevice()

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

	const showaddFieldDialog = useCallback(() => {
		dispatch(showFullScreenDialog(<DeviceEditAddField 
			field={{
				name:"",
				type: DeviceFieldType.NUMBER,
				low:"0",
				high:"100",
				unit:"",
				address:"",
				value:"",
				entity: "",
				read_only: true,
				enum_values: "",
				icon: "",
				virtual_field: false
			}} 
			option={getOption()} 
		setField={(field)=>{
			setDevice(prev=>{
				if(!prev)
					return prev
				else{
					let fields = prev.fields.slice()
					fields.push(field)
					return {...prev, fields}
				}
			})
		}}/>))
        
	},[dispatch])

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

	const deleteDeviceBtnClick = useCallback(() => {
		dispatch(showDialog(<BaseDialog 
			actionText='delete device' 
			header='delete device' 
			text='are you sure you want to delete the device.' 
			onHide={()=>dispatch(hideDialog())}
			onSuccess={()=>{
				deleteDevice(systemName)
				hide()
			}}
		/>))
	},[dispatch, deleteDevice])

	return(
		<FullScrinTemplateDialog onHide={hide} header={`Edit ${device?.name}`} onSave={save}>
			<div className="device-edit-container">
				<div className='device-edit-base-data table-container'>
					<table>
						<tbody>
							<tr>
								<td>Device type:</td>
								<td>{device?.type}</td>
							</tr>
							<tr>
								<td>Device class:</td>
								<td>{device?.class_device}</td>
							</tr>
						</tbody>
					</table>
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
						<div className='btn-container'>
							{
								(getOption().added.fields)?
								<FilledButton onClick={showaddFieldDialog}>add field</FilledButton>:
								null
							}
							<FilledButton style={{background: "var(--Error-color)", color: "var(--On-error-color)"}} onClick={deleteDeviceBtnClick}>delete device</FilledButton>
						</div>
					</>:
					null
				}
				</div>
			</div>
		</FullScrinTemplateDialog>
	)
}