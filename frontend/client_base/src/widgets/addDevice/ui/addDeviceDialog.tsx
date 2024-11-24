import { useCallback, useState } from "react"
import { SelectDeviceDialog } from "./selectDeviceClass"
import { DeviceClassOptions } from "../models/options"
import { DeviceData } from "./deviceData"
import './addDeviceDialog.scss'
import { AddDeviceData } from "../models/deviceData"
import { useCreateDevice } from "../api/createDevice"

type addDeviceDialogProps = {
    onHide: ()=>void
}

export const AddDeviceDialog:React.FC<addDeviceDialogProps> = ({onHide}) => {

    const [option, setOption] = useState<DeviceClassOptions | undefined>(undefined)
    const {createDevice} = useCreateDevice()

    const save = useCallback((data: AddDeviceData) => {
        if(option?.class_name){
            createDevice({...data, class_device: option?.class_name, type: ''})
            onHide()
        }

    },[createDevice, option])

    if(option === undefined)
        return(
            <SelectDeviceDialog onHide={onHide} onChange={setOption}/>
        )

    return (
        <DeviceData option={option} onHide={onHide} onSave={save}/>
    )
    
}