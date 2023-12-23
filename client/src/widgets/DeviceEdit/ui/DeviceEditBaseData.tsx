import { DeviceData } from "../../../entites/Device"
import { DeviceOption } from "../../../features/DeviceOption"
import { FieldContainer, SelectField, TextField } from "../../../shared/ui"

interface DeviceEditBaseDataProps{
	device: DeviceData
	option: DeviceOption
	setDevice: (value:React.SetStateAction<DeviceData | null>)=>void
}

export const DeviceEditBaseData = ({device, option, setDevice}:DeviceEditBaseDataProps) => {

	const changeName = (value:string) => setDevice(prev=>(prev?{...prev, name: value}:prev))
	const changeSystemName = (value:string) => setDevice(prev=>(prev?{...prev, system_name: value}:prev))
	const changeAddress = (value:string) => setDevice(prev=>(prev?{...prev, address: value}:prev))
	const changeToken = (value:string) => setDevice(prev=>(prev?{...prev, token: value}:prev))
	const changePolling = (value:boolean) => setDevice(prev=>(prev?{...prev, device_cyclic_polling: value}:prev))

	return(
		<>
		<FieldContainer header="Name">
			<TextField border value={device.name} onChange={(e)=>changeName(e.target.value)}/>
		</FieldContainer>
		<FieldContainer header="System name">
			<TextField border value={device.system_name} onChange={(e)=>changeSystemName(e.target.value)}/>
		</FieldContainer>
		{
			(option.change.address)?
			<FieldContainer header="Address">
				<TextField border value={device.address} onChange={(e)=>changeAddress(e.target.value)}/>
			</FieldContainer>:
			null
		}
		{
			(option.change.polling)?
			<FieldContainer header="Pulling">
				<SelectField items={[{title: "flase", value: "false"}, {title: "true", value: "true"}]} border value={String(device.device_cyclic_polling)} name="virtual" onChange={(value)=>changePolling(value === "true")}/>
			</FieldContainer>:
			null
		}
		{
			(option.change.token)?
			<FieldContainer header="Token">
				<TextField border value={device.token} onChange={(e)=>changeToken(e.target.value)}/>
			</FieldContainer>:
			null
		}
		</>
	)
}