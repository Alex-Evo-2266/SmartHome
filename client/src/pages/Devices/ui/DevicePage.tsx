import './DevicePage.scss'
import { useAppDispatch, useAppSelector } from "../../../shared/lib/hooks/redux"
import { FAB, GridLayout, GridLayoutItem } from "alex-evo-sh-ui-kit"
import { DeviceCard } from "../../../widgets/DeviceCard"
import { Filter, PlusCircle } from 'lucide-react'
import { showFullScreenDialog } from '../../../shared/lib/reducers/dialogReducer'
import { DeviceEditDialog } from '../../../widgets/DeviceEdit'
import { DeviceAddDialog } from '../../../widgets/DeviceAddManual'
import { useCallback, useEffect, useState } from 'react'
import { DeviceData } from '../../../entites/Device'
import { ScreenSize, useScreenSize } from '../../../entites/ScreenSize'
import { SearchBar } from '../../../features/SearchBar'
import { UseFilter } from '../../../shared/lib/hooks/filterMenu.hook'
import { setNavigationButton } from '../../../features/Navigation/lib/reducers/NavigationReducer'

export const DevicePage = () => {

	const {devices} = useAppSelector(state=>state.device)
	const [devicesData, setDevices] = useState<DeviceData[]>([])
	const [devicesName, setDeviceName] = useState<string>('')
	const dispatch = useAppDispatch()
	const {screen} = useScreenSize()

	const getDeviceTypes = useCallback(()=>{
		return Array.from(new Set(devices.map(item=>item.class_device)))
	},[devices])

	const {togleMenu, setItems, filter} = UseFilter()

	const editDevice = (systemName: string) => {
		dispatch(showFullScreenDialog(<DeviceEditDialog systemName={systemName}/>))
	}

	const addDevice = () => {
		dispatch(showFullScreenDialog(<DeviceAddDialog/>))
	}

	const search = useCallback((data:string, types: string[] = [])=>{
		let arrayRow = devices.filter(item => types.length === 0 || types.includes(item.class_device))
		if(data===""){
			setDevices(arrayRow)
			return
		}
		let array = arrayRow.filter(item => item.name.toLowerCase().indexOf(data.toLowerCase())!==-1)
		setDevices(array)
	},[devices])

	useEffect(()=>{
		search(devicesName, filter)
	},[search, devicesName, filter])

	useEffect(()=>{
		setItems(getDeviceTypes())
	},[getDeviceTypes])

	useEffect(()=>{
		dispatch(setNavigationButton({icon: <Filter/>, onClick:togleMenu, text:"filter"}))
		return ()=>{
			dispatch(setNavigationButton(undefined))
		}
	},[dispatch, togleMenu])

	return(
		<>
		<SearchBar search={data=>setDeviceName(data)}/>
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
			<FAB icon={<PlusCircle/>} onClick={addDevice}>{(screen !== ScreenSize.MOBILE)?"Add Device":null}</FAB>
		</div>
		</>
		
	)
}