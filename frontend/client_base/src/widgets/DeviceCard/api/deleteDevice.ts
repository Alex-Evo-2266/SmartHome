import { useCallback, useEffect } from "react"
import { TypeRequest } from "../../../shared/api/type"
import { useHttp } from "../../../shared/lib/hooks/http.hook"
import { useSnackbar } from "../../../shared/lib/hooks/snackbar.hook"


export const useDeleteDevice = () => {

    const {request, loading, error, clearError} = useHttp()
    const {showSnackbar} = useSnackbar()

    const deleteDevice = useCallback(async (system_name:string) => {
        await request(`/api-devices/devices/${system_name}`, TypeRequest.DELETE)
    },[request])

    useEffect(()=>{
        if (error)
            showSnackbar(error, {}, 10000)
        return ()=>{
            clearError();
        }
    },[error, clearError, showSnackbar])

    return{
        deleteDevice,
        loading
    }
}