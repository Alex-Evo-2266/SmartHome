import './DevicePage.scss'
import { useAppDispatch, useAppSelector } from "../../../shared/lib/hooks/redux"
import { FAB, FilterBtn, GridLayout, GridLayoutItem, IconButton } from "../../../shared/ui"
import { DeviceCard } from "../../../widgets/DeviceCard"
import { MoreVertical, PlusCircle } from 'lucide-react'
import { showFullScreenDialog } from '../../../shared/lib/reducers/dialogReducer'
import { DeviceEditDialog } from '../../../widgets/DeviceEdit'
import { DeviceAddDialog } from '../../../widgets/DeviceAddManual'
import { useCallback, useEffect, useState } from 'react'
import { DeviceData } from '../../../entites/Device'
import { setSearch } from '../../../features/Navigation/lib/reducers/NavigationReducer'
import { showMenu } from '../../../shared/lib/reducers/menuReducer'

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

	const getDeviceTypes = useCallback(()=>{
		return Array.from(new Set(devices.map(item=>item.class_device)))
	},[devices])

	return(
		<div className="device-page">
			<FilterBtn style={{position: "fixed", right: "10px"}} items={getDeviceTypes()} onChange={(data)=>console.log(data)}/>
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