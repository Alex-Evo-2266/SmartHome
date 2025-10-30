import { useCallback, useEffect } from "react"

import { TypeRequest } from "../../../shared/api/type"
import { useHttp } from "../../../shared/lib/hooks/http.hook"
import { useSnackbar } from "../../../shared/lib/hooks/snackbar.hook"
import { EditDeviceDataSendSchema } from "../models/editDeviceSchema"


export const useEditDevice = () => {

    const {request, loading, error, clearError} = useHttp()
    const {showSnackbar} = useSnackbar()

    const editDevice = useCallback(async (data: EditDeviceDataSendSchema, system_name:string) => {
        await request(`/api-devices/devices/${system_name}`, TypeRequest.PUT, data)
    },[request])

    useEffect(()=>{
		if (error)
			showSnackbar(error, {}, 10000)
		return ()=>{
			clearError();
		}
	},[error, clearError, showSnackbar])

    return{
        editDevice,
        loading
    }
}