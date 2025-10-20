import { useCallback, useEffect } from "react"
import { useHttp } from "../../../shared/lib/hooks/http.hook"
import { useSnackbar } from "../../../shared/lib/hooks/snackbar.hook"


export const useSendValue = () => {

    const {request, loading, error, clearError} = useHttp()
        const {showSnackbar} = useSnackbar()

    const sendValue = useCallback(async (systemName: string, fieldId: string, value: string) => {
        await request(`/api-devices/devices/${systemName}/values/${fieldId}/set/${value}`)
    },[request])

    useEffect(()=>{
            if (error)
                showSnackbar(error, {}, 10000)
            return ()=>{
                clearError();
            }
        },[error, clearError, showSnackbar])

    return {
        sendValue,
        loading
    }
}