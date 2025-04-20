import { useCallback, useEffect } from "react"
import { useHttp } from "../../../shared/lib/hooks/http.hook"
import { useSnackbar } from "../../../shared/lib/hooks/snackbar.hook"
import { DeviceHistory } from "../models/history"


export const useLoadHistory = () => {

    const {request, loading, error, clearError} = useHttp()
    const {showSnackbar} = useSnackbar()

    const getDeviceHistory = useCallback(async (systemName: string) => {
        const data:DeviceHistory = await request(`/api-devices/stories/device/${systemName}`)
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