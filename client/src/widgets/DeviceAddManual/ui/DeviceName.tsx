import { useCallback, useState } from "react"
import { FilledButton, TextField, Button } from "../../../shared/ui"
import { DeviceOption } from "../../../features/DeviceOption"

interface DeviceEnterNameDialogProps{
	option: DeviceOption
    name: string
    systemName: string
	onNext: (name: string, systemName: string)=>void
    onPrev: ()=>void
}

export const DeviceEnterNameDialog = (prop:DeviceEnterNameDialogProps) => {

	const [name, setName] = useState<string>(prop.name)
	const [systemName, setSystemName] = useState<string>(prop.systemName)

	const next = useCallback(() => {
        if(name == "" || systemName == "")
			return
		prop.onNext(name, systemName)
	},[name, systemName])

    const changeName = useCallback((event:React.ChangeEvent<HTMLInputElement>) => {
        if(!systemName || systemName == name)
            setSystemName(event.target.value)
        setName(event.target.value)
    },[systemName, name])

	return(
		<>
		<div className="device-add-container">
			<TextField border className="transparent" placeholder="name" onChange={changeName} value={name}></TextField>
		</div>
        <div className="device-add-container">
			<TextField border className="transparent" placeholder="system name" onChange={(e)=>setSystemName(e.target.value)} value={systemName}></TextField>
		</div>
		<div className="device-add-container btn-container">
            <Button onClick={prop.onPrev}>Back</Button>
			<FilledButton onClick={next}>Next</FilledButton>
		</div>
		</>
	)
}