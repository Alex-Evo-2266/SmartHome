import { useEffect, useState } from 'react'
import './DeviceAddDialog.scss'
import { DeviceAddChoiceSlassDialog } from './DeviceСhoiceClass'
import { DeviceOption } from '../../../features/DeviceOption'
import { DeviceAddData, FieldDevice, ValueType } from '../../../entites/Device/models/deviceData'
import { DeviceEnterAddressDialog } from './DeviceEnterAddress'
import { useAppDispatch } from '../../../shared/lib/hooks/redux'
import { hideFullScreenDialog } from '../../../shared/lib/reducers/dialogReducer'
import { FullScrinTemplateDialog } from "alex-evo-sh-ui-kit"
import { DeviceEnterNameDialog } from './DeviceName'
import { DeviceFinishDialog } from './DeviceFinishConfig'
import { DeviceTypeDialog } from './DeviceType'
import { DeviceAddFieldDialog } from './DeviceAddField'


export enum Pages{
    CLASS_PAGE = 'class_page',
    ADDRESS_PAGE = 'address_page',
	TYPE_PAGE = "type_page",
	FIELDS_PAGE = "fields_page",
	NAME_PAGE = "name_page",
	FINISH_PAGE = "finish_page"
}

const emptyDeviceData = {
	name: "", 
	system_name: "",
	class_device: "",
	type_field: "",
	address: "",
	token: "",
	fields: [],
	type_command: ValueType.JSON,
	type: "light",
	device_cyclic_polling: false
}

export const DeviceAddDialog = () => {

	const dispatch = useAppDispatch()
	const [page, setPage] = useState<number>(0)
	const [pages, setPages] = useState<Pages[]>([])
	const [deviceOption, setDeviceOption] = useState<DeviceOption | null>(null)
	const [deviceData, setDeviceData] = useState<DeviceAddData>(emptyDeviceData)

	const hide = () => {
		dispatch(hideFullScreenDialog())
	}

	const setClass = (data:DeviceOption) => {
		setDeviceOption(data)
		setDeviceData({...emptyDeviceData, class_device:data.class_name})
		let pages = [Pages.CLASS_PAGE, Pages.TYPE_PAGE]
		if(data?.added.address || data?.added.token)
			pages.push(Pages.ADDRESS_PAGE)
		if(data?.added.fields)
			pages.push(Pages.FIELDS_PAGE)
		pages.push(Pages.NAME_PAGE)
		pages.push(Pages.FINISH_PAGE)
		setPages(pages)
		setPage(prev=>prev + 1)
	}

	const setAddress = (address: string, token: string, polling: boolean) => {
		setDeviceData(prev=>({...prev, address: address, token: token, device_cyclic_polling: polling}))
		setPage(prev=>prev + 1)
	}

	const setName = (name: string, system_name: string) => {
		setDeviceData(prev=>({...prev, name: name, system_name: system_name}))
		setPage(prev=>prev + 1)
	}

	const setType = (type: string) => {
		setDeviceData(prev=>({...prev, type}))
		setPage(prev=>prev + 1)
	}

	const setFields = (fields: FieldDevice[]) => {
		setDeviceData(prev=>({...prev, fields}))
		setPage(prev=>prev + 1)
	}

	useEffect(()=>{
		console.log(deviceData, pages, pages[page])
	},[deviceData, page, pages])


	return(
		<FullScrinTemplateDialog onHide={hide} header={`Add device`} className=''>
			{
				(!deviceOption || pages[page] == Pages.CLASS_PAGE)?
				<DeviceAddChoiceSlassDialog onClick={setClass}/>:
				(pages[page] == Pages.TYPE_PAGE)?
				<DeviceTypeDialog option={deviceOption} onNext={setType} onPrev={()=>setPage(prev=>prev - 1)}/>:
				(pages[page] == Pages.ADDRESS_PAGE)?
				<DeviceEnterAddressDialog option={deviceOption} token={deviceData.token ?? ""} polling={deviceData.device_cyclic_polling} address={deviceData.address ?? ""} onNext={setAddress} onPrev={()=>setPage(prev=>prev - 1)}/>:
				(pages[page] == Pages.FIELDS_PAGE)?
				<DeviceAddFieldDialog fields={deviceData.fields} option={deviceOption} onPrev={()=>setPage(prev=>prev - 1)} onNext={setFields}/>:
				(pages[page] == Pages.NAME_PAGE)?
				<DeviceEnterNameDialog option={deviceOption} name={deviceData.name} systemName={deviceData.system_name} onNext={setName} onPrev={()=>setPage(prev=>prev - 1)}/>:
				(pages[page] == Pages.FINISH_PAGE)?
				<DeviceFinishDialog option={deviceOption} onNext={hide} device={deviceData} onPrev={()=>setPage(prev=>prev - 1)}/>:
				null
			}
		</FullScrinTemplateDialog>
	)
}