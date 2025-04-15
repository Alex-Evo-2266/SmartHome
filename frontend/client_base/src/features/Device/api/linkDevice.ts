import { useCallback, useEffect } from "react"
import { TypeRequest } from "../../../shared/api/type"
import { useHttp } from "../../../shared/lib/hooks/http.hook"
import { useSnackbar } from "../../../shared/lib/hooks/snackbar.hook"


export const useLinkDevice = () => {

    const {request, loading, error, clearError} = useHttp()
    const {showSnackbar} = useSnackbar()

    const linkDevice = useCallback(async (system_name:string, status: boolean) => {
        await request(`/api-devices/devices/${system_name}/polling`, TypeRequest.PATCH, {status})
    },[request])

    useEffect(()=>{
        if (error)
            showSnackbar(error, {}, 10000)
        return ()=>{
            clearError();
        }
    },[error, clearError, showSnackbar])

    return{
        linkDevice,
        loading
    }
}