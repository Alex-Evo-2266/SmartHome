import { useState } from "react"
import { FilledButton, TextField, Button } from "../../../shared/ui"
import { DeviceOption } from "../../../features/DeviceOption"

interface DeviceAddEnterAddressDialogProps{
	option: DeviceOption
	address: string
	token: string
	onNext: (adddess: string, token: string)=>void
	onPrev: ()=>void
}

export const DeviceEnterAddressDialog = (prop:DeviceAddEnterAddressDialogProps) => {

	const [token, setToken] = useState<string>(prop.token ?? "")
	const [adddess, setAddress] = useState<string>(prop.address ?? "")

	const next = () => {
		if(prop.option.added.address && adddess == "")
			return
		if(prop.option.added.token && token == "")
			return
		prop.onNext(adddess, token)
	}

	return(
		<>
		{
			(prop.option.added.address)?
			<div className="device-add-container">
				<TextField border className="transparent" value={adddess} placeholder="address" onChange={(e)=>setAddress(e.target.value)}></TextField>
			</div>:
			null
		}
		{
			(prop.option.added.token)?
			<div className="device-add-container">
				<TextField className="transparent" value={token} placeholder="token" onChange={(e)=>setToken(e.target.value)}></TextField>
			</div>:
			null
		}      
		<div className="device-add-container btn-container">
			<Button onClick={prop.onPrev}>Back</Button>
			<FilledButton onClick={next}>Next</FilledButton>
		</div>
		  
		</>
	)
}