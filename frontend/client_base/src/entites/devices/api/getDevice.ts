import { useCallback, useEffect } from "react"

import { useHttp } from "../../../shared/lib/hooks/http.hook"
import { useSnackbar } from "../../../shared/lib/hooks/snackbar.hook"
import { DeviceSchema } from "../models/device"


export const useDeviceAPI = () => {

    const {request, loading, error, clearError} = useHttp()
    const {showSnackbar} = useSnackbar()

    const getDevice = useCallback(async (systemName: string) => {
        const data:DeviceSchema = await request(`/api-devices/devices/${systemName}`)
        return data
    },[request])

    const getDevices = useCallback(async () => {
        const data:{data: DeviceSchema[]} = await request(`/api-devices/devices`)
        return data.data
    },[request])

    useEffect(()=>{
            if (error)
                showSnackbar(error, {}, 10000)
            return ()=>{
                clearError();
            }
        },[error, clearError, showSnackbar])

    return {
        getDevice,
        getDevices,
        loading
    }
}