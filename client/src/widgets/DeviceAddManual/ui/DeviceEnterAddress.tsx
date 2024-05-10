import { useState } from "react"
import { FilledButton, TextField, Button, FieldContainer } from "alex-evo-sh-ui-kit"
import { DeviceOption } from "../../../features/DeviceOption"
import { SelectField } from "../../../shared/ui"

interface DeviceAddEnterAddressDialogProps{
	option: DeviceOption
	address: string
	token: string
	polling: boolean
	onNext: (adddess: string, token: string, polling: boolean)=>void
	onPrev: ()=>void
}

export const DeviceEnterAddressDialog = (prop:DeviceAddEnterAddressDialogProps) => {

	const [token, setToken] = useState<string>(prop.token ?? "")
	const [adddess, setAddress] = useState<string>(prop.address ?? "")
	const [pulling, setPulling] = useState<boolean>(prop.polling ?? false)

	const next = () => {
		if(prop.option.added.address && adddess == "")
			return
		if(prop.option.added.token && token == "")
			return
		prop.onNext(adddess, token, pulling)
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
			(prop.option.added.polling)?
			<FieldContainer header="Polling">
				<SelectField items={[{title: "flase", value: "false"}, {title: "true", value: "true"}]} border value={String(pulling)} name="virtual" onChange={(value)=>setPulling((value === "true"))}/>
			</FieldContainer>:
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