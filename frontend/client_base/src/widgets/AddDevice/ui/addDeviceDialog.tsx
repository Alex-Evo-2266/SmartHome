import { useCallback, useState } from "react"
import { SelectDeviceDialog } from "./selectDeviceClass"
import { DeviceData } from "./deviceData"
import './addDeviceDialog.scss'
import { AddDeviceData } from "../models/deviceData"
import { useCreateDevice } from "../api/createDevice"
import { DeviceClassOptions } from "../../../entites/devices"

type addDeviceDialogProps = {
    onHide: ()=>void
}

export const AddDeviceDialog:React.FC<addDeviceDialogProps> = ({onHide}) => {

    const [option, setOption] = useState<DeviceClassOptions | null>(null)
    const {createDevice} = useCreateDevice()

    const className = option?.class_name
    const save = useCallback((data: AddDeviceData) => {
        if(className){
            createDevice({...data, class_device: className, type: ''})
            onHide()
        }
    },[createDevice, className])

    if(option === null)
        return(
            <SelectDeviceDialog onHide={onHide} onChange={setOption}/>
        )

    return (
        <DeviceData option={option} onHide={onHide} onSave={save}/>
    )
    
}