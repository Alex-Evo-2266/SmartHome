import { useCallback, useEffect } from "react"
import { useHttp } from "../../../shared/lib/hooks/http.hook"
import { useSnackbar } from "../../../shared/lib/hooks/snackbar.hook"
import { DeviceHistory } from "../models/history"


export const useLoadHistory = () => {

    const {request, loading, error, clearError} = useHttp()
    const {showSnackbar} = useSnackbar()

    const getDeviceHistory = useCallback(async (systemName: string, time_start?: string) => {
        let data:DeviceHistory
        if(time_start)
            data = await request(`/api-devices/stories/device/${systemName}?time_start=${time_start}`)
        else
            data = await request(`/api-devices/stories/device/${systemName}`)
        return data
    },[request])

    useEffect(()=>{
            if (error)
                showSnackbar(error, {}, 10000)
            return ()=>{
                clearError();
            }
        },[error, clearError, showSnackbar])

    return {
        getDeviceHistory,
        loading
    }
}