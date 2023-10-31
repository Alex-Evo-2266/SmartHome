import { FilledButton, Button } from "../../../shared/ui"
import { DeviceOption } from "../../../features/DeviceOption"
import { DeviceAddData } from "../../../entites/Device/models/deviceData"
import { UseCreateDevice } from "../api/createDeviceAPI"

interface DeviceFinishDialogProps{
	option: DeviceOption
	device: DeviceAddData
    onPrev: ()=>void
    onNext: ()=>void
}

export const DeviceFinishDialog = (prop:DeviceFinishDialogProps) => {

    const {addDevice} = UseCreateDevice()

	const next = async() => {
        let ret = await addDevice(prop.device)
        if (ret)
            prop.onNext()
	}


	return(
		<>
		<div className="device-add-container">
			<p>name {prop.device.name}</p>
			<p>system name {prop.device.system_name}</p>
			<p>address {prop.device.address}</p>
			<p>token {prop.device.token}</p>
		</div>
		<div className="device-add-container btn-container">
            <Button onClick={prop.onPrev}>Back</Button>
			<FilledButton onClick={next}>Create</FilledButton>
		</div>
		</>
	)
}