import './DeviceEditDialog.scss'
import { useCallback, useEffect, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../../shared/lib/hooks/redux"
import { hideFullScreenDialog } from "../../../shared/lib/reducers/dialogReducer"
import { Divider, FullScrinTemplateDialog } from "../../../shared/ui"
import { DeviceData, findDevice } from "../../../entites/Device"
import { DeviceEditBaseData } from "./DeviceEditBaseData"
import { DeviceEditField } from "./DeviceEditFields"
import { UseEditDevice } from '../api/putDevice'

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
		return deviceOptions.filter(item => item.class_name == device?.class_device)
	},[device])

	const hide = () => {
		dispatch(hideFullScreenDialog())
	}

	const changeDevice = (value:React.SetStateAction<DeviceData | null>) => {
		setDevice(value)
	}

	const save = useCallback(() => {
		if(!device)
			return
		editDevice(device, systemName)
		hide()
	},[editDevice, systemName, device])

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
						<DeviceEditField device={device} option={getOption()} setDevice={changeDevice}/>
					</>:
					null
				}
				</div>
			</div>
		</FullScrinTemplateDialog>
	)
}