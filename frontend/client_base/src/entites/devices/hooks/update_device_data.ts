import { useCallback, useEffect } from "react"

import { useAppDispatch } from "../../../shared/lib/hooks/redux"
import { DeviceSchema, PatchStateDevice } from "../models/device"
import { setDevicesData, updateDeviceValue } from "../reducers/device_data"
import { useDeviceAPI } from "../api/getDevice"


export const useUpdateDeviceData = () => {

    const dispatch = useAppDispatch()
    const {getDevices} = useDeviceAPI()

    const updateDevicedata = useCallback((data: DeviceSchema[])=>{
        dispatch(setDevicesData(data))
    },[dispatch])

    const patchDeviceState = useCallback((data: PatchStateDevice)=>{
        dispatch(updateDeviceValue(data))
    },[dispatch])

    const loadData = useCallback(async() => {
        const data = await getDevices()
        dispatch(setDevicesData(data))
    },[getDevices, dispatch])

    useEffect(()=>{
        loadData()
    },[loadData])

    return {updateDevicedata, patchDeviceState}
}