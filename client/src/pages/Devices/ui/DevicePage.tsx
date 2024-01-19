import './DevicePage.scss'
import { useAppDispatch, useAppSelector } from "../../../shared/lib/hooks/redux"
import { FAB, GridLayout, GridLayoutItem } from "../../../shared/ui"
import { DeviceCard } from "../../../widgets/DeviceCard"
import { PlusCircle } from 'lucide-react'
import { showFullScreenDialog } from '../../../shared/lib/reducers/dialogReducer'
import { DeviceEditDialog } from '../../../widgets/DeviceEdit'
import { DeviceAddDialog } from '../../../widgets/DeviceAddManual'
import { useCallback, useEffect, useState } from 'react'
import { DeviceData } from '../../../entites/Device'
import { setSearch } from '../../../features/Navigation/lib/reducers/NavigationReducer'

export const DevicePage = () => {

	const {devices} = useAppSelector(state=>state.device)
	const [devicesData, setDevices] = useState<DeviceData[]>([])
	const [devicesName, setDeviceName] = useState<string>('')
	const dispatch = useAppDispatch()

	const editDevice = (systemName: string) => {
		dispatch(showFullScreenDialog(<DeviceEditDialog systemName={systemName}/>))
	}

	const addDevice = () => {
		dispatch(showFullScreenDialog(<DeviceAddDialog/>))
	}

	const search = useCallback((data:string)=>{
		if(data===""){
			setDevices(devices)
			return
		}
		let array = devices.filter(item => item&&item.name.toLowerCase().indexOf(data.toLowerCase())!==-1)
		setDevices(array)
	},[devices])

	useEffect(()=>{
		search(devicesName)
	},[search, devicesName])

	useEffect(()=>{
		dispatch(setSearch((data)=>setDeviceName(data)))
	},[dispatch])

	return(
		<div className="device-page">
			<GridLayout itemMinWith='250px' itemMaxWith='350px' gridColumnGap='10px'>
			{
				devicesData.map((item, index)=>(
					<GridLayoutItem key={index}>
						<DeviceCard device={item} onClickEditButton={()=>editDevice(item.system_name)}/>
					</GridLayoutItem>
				))
			}
			</GridLayout>
			<FAB icon={<PlusCircle/>} onClick={addDevice}>Add Device</FAB>
		</div>
	)
}