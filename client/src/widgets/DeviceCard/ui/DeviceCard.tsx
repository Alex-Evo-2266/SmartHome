import './DeviceCard.scss'
import { DeviceData } from "../../../entites/Device"
import { Card, IconButton } from "../../../shared/ui"
import { DefaultFieldControl, DeviceField } from '../../../features/DeviceControl'
import { MoreVertical } from 'lucide-react'
import { useAppDispatch } from '../../../shared/lib/hooks/redux'
import { showBaseMenu } from '../../../shared/lib/reducers/menuReducer'
import { IMenuItem } from '../../../shared/model/menu'
import { useCallback } from 'react'
import { useLincDeviceAPI } from '../api/lincAPI'

interface DeviceCardProps{
	device: DeviceData
	onClickEditButton?: () => void
}

export const DeviceCard = ({device, onClickEditButton}:DeviceCardProps) => {

	const dispatch = useAppDispatch()
	const {linc, unlinc} = useLincDeviceAPI()

	const getMenu = useCallback(():IMenuItem[] => {
		let arr:IMenuItem[] = [{
			title: "edit",
			onClick: onClickEditButton
		}]
		if(device.device_status === "unlink")
			arr.push({
				title: "linc",
				onClick: ()=>linc(device.system_name)
			})
		else
			arr.push({
				title: "unlink",
				onClick: ()=>unlinc(device.system_name)
			})
		return arr
	},[device, onClickEditButton])

	const onMenu = useCallback((event:React.MouseEvent<HTMLElement>) => {
		dispatch(showBaseMenu(getMenu(), event.pageX, event.pageY, {autoHide: true}))
	},[getMenu, dispatch])

	console.log(device?.device_status ?? "")

	return(
		<Card header={device.name} className="device-card" iconButtonCell={<IconButton icon={<MoreVertical/>} onClick={onMenu}/>}>
			<div className='device-card-content'>
			{
				(device.device_status !== "online")?
				<>
				<div className='status-field'>
					<DefaultFieldControl value={device.device_status} className={`${(device.device_status == "offline")?"offline-field":(device.device_status == "unlink")?"unlink-field":""}`}/>
				</div>
				<div className='disable-control'></div>
				</>:
				null
			}
			{
				device.fields.map((item, index)=>(
					<DeviceField key={index} field={item} systemName={device.system_name} value={device.value[item.name]}/>
				))
			}
			</div>
		</Card>
	)
}