import { FilledButton, Button } from "alex-evo-sh-ui-kit"
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

// 	<p>name: {prop.device.name}</p>
// 	<p>system name: {prop.device.system_name}</p>
// 	<p>address: {prop.device.address}</p>
// 	<p>token: {prop.device.token}</p>
// </div>
	return(
		<>
		<div className='device-add-container table-container'>
			<table>
				<tbody>
					<tr>
						<td>name</td>
						<td>{prop.device.name}</td>
					</tr>
					<tr>
						<td>system name</td>
						<td>{prop.device.system_name}</td>
					</tr>
					<tr>
						<td>address</td>
						<td>{prop.device.address}</td>
					</tr>
					<tr>
						<td>token</td>
						<td>{prop.device.token}</td>
					</tr>
				</tbody>
			</table>
		</div>
		<div>
			Fields : не реализованно
		</div>
		<div className="device-add-container btn-container">
            <Button onClick={prop.onPrev}>Back</Button>
			<FilledButton onClick={next}>Create</FilledButton>
		</div>
		</>
	)
}