import { useMemo } from "react"
import { DeviceSchema, useGetOptionDevice } from "../../../entites/devices"
import { DeviceEditDialog } from "./DeviceEditDialog"
import './EditDevice.scss'

interface DeviceDataProps{
    data: DeviceSchema
    onHide: ()=>void
}

export const DeviceEdit:React.FC<DeviceDataProps> = ({data, onHide}) => {

    const {options} = useGetOptionDevice()
    const option = useMemo(()=>options?.find(item=>item.class_name === data.class_device),[options])
    
    if(!option)
        return null

    return(<DeviceEditDialog onHide={onHide} data={data} option={option}/>)
}