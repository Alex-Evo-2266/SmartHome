import { useMemo } from "react"

import { DeviceEditDialog } from "./DeviceEditDialog"
import { DeviceSchema, useGetOptionDevice } from "../../../entites/devices"
import './EditDevice.scss'

interface DeviceDataProps{
    data: DeviceSchema
    onHide: ()=>void
    loadData: ()=>void
}

export const DeviceEdit:React.FC<DeviceDataProps> = ({data, onHide, loadData}) => {

    const {options} = useGetOptionDevice()
    const option = useMemo(()=>options?.find(item=>item.class_name === data.class_device),[options, data.class_device])
    
    if(!option)
        return null

    return(<DeviceEditDialog onHide={onHide} data={data} option={option} loadData={loadData}/>)
}