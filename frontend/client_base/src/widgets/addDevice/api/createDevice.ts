import { useCallback, useEffect } from "react"
import { TypeRequest } from "../../../shared/api/type"
import { useHttp } from "../../../shared/lib/hooks/http.hook"
import { useSnackbar } from "../../../shared/lib/hooks/snackbar.hook"
import { CreateDeviceData } from "../models/deviceData"


export const useCreateDevice = () => {

    const {request, loading, error, clearError} = useHttp()
    const {showSnackbar} = useSnackbar()

    const createDevice = useCallback(async (data: CreateDeviceData) => {
        await request('/api-devices/devices', TypeRequest.POST, data)
    },[request])

    useEffect(()=>{
		if (error)
			showSnackbar(error, {}, 10000)
		return ()=>{
			clearError();
		}
	},[error, clearError, showSnackbar])

    return{
        createDevice,
        loading
    }
}