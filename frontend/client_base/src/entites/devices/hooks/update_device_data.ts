import { useCallback } from "react"

import { useAppDispatch } from "../../../shared/lib/hooks/redux"
import { DeviceSchema } from "../models/device"
import { setDevicesData } from "../reducers/device_data"


export const useUpdateDeviceData = () => {

    const dispatch = useAppDispatch()

    const updateDevicedata = useCallback((data: DeviceSchema[])=>{
        dispatch(setDevicesData(data))
    },[dispatch])

    return {updateDevicedata}
}