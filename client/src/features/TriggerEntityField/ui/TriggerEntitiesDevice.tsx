import { useCallback, useState } from "react"
import { useAppDispatch, useAppSelector } from "../../../shared/lib/hooks/redux"
import { hideFullScreenDialog } from "../../../shared/lib/reducers/dialogReducer"
import { FieldContainer, FullScrinTemplateDialog, SelectField } from "../../../shared/ui"
import { DeviceData } from "../../../entites/Device"

interface TriggerTimeProps{
	onChange: (data: string)=>void 
}

export const TriggerEntitiesDeviceDialog = ({onChange}:TriggerTimeProps) => {

    const dispatch = useAppDispatch()
    const {devices} = useAppSelector(state=>state.device)
    const [device, setDevice] = useState<DeviceData | null>(null)
    const [field, setField] = useState<string | null>(null)

    const getItemsDevice = useCallback(()=>{
        return devices.map(item=>({title: item.name, value: item.system_name}))
    },[devices])

    const getItemsField = useCallback(()=>{
        return device?.fields.map(item=>({title: item.name, value: item.name})) || []
    },[device])

    const hide = () => {
		dispatch(hideFullScreenDialog())
	}

    const changeDevice = useCallback((system_name: string)=>{
        let device = devices.filter((item)=>item.system_name === system_name)
        if (device.length > 0){
            setDevice(device[0])
            setField(null)
        }
    },[devices])

    const changeField = useCallback((name: string)=>{
        let field = device?.fields.filter((item)=>item.name === name) || []
        if (field.length > 0)
            setField(field[0].name)
    },[device])

    const save = useCallback(() => {
        onChange(`device.${device?.system_name}.${field}`)
	},[device, field])

    return(
        <FullScrinTemplateDialog onHide={hide} onSave={save} header={"Trigger"}>
            <FieldContainer header="Device">
                <SelectField border items={getItemsDevice()} onChange={changeDevice} value={device?.system_name}/>
            </FieldContainer>
            {
                (device)?
                <FieldContainer header="Field">
                    <SelectField border items={getItemsField()} onChange={changeField} value={field || ""}/>
                </FieldContainer>
                :null
            }
        </FullScrinTemplateDialog>
    )
}
