import './DeviceCard.scss'
import { DeviceData } from "../../../entites/Device"
import { Card, IconButton } from "../../../shared/ui"
import { DeviceField } from '../../../features/DeviceControl'
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
		if(device.status === "unlinc")
			arr.push({
				title: "linc",
				onClick: ()=>linc(device.system_name)
			})
		else
			arr.push({
				title: "unlinc",
				onClick: ()=>unlinc(device.system_name)
			})
		return arr
	},[device, onClickEditButton])

	const onMenu = useCallback((event:React.MouseEvent<HTMLElement>) => {
		dispatch(showBaseMenu(getMenu(), event.pageX, event.pageY, {autoHide: true}))
	},[getMenu, dispatch])

	return(
		<Card header={device.name} className="device-card" iconButtonCell={<IconButton icon={<MoreVertical/>} onClick={onMenu}/>}>
			<div className='device-card-content'>
			{
				(device.status !== "online")?
				<div className='status-field'>
					{device.status}
				</div>:
				device.fields.map((item, index)=>(
					<DeviceField key={index} field={item} systemName={device.system_name} value={device.value[item.name]}/>
				))
			}
			</div>
		</Card>
	)
}