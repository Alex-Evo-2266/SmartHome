import { useCallback, useEffect } from "react"
import { useHttp } from "../../../features/RequestWithAuthentication"
import { useSnackbar } from "../../../shared/lib/hooks/snackbar.hook"
import { DeviceData } from "../../../entites/Device"
import { TypeRequest } from "../../../shared/api/type"
import { useAppSelector } from "../../../shared/lib/hooks/redux"

export const UseEditDevice = () => {

    const {request, error, clearError} = useHttp()
	const {showSnackbar} = useSnackbar()
    const authData = useAppSelector(state=>state.auth)

    const editDevice = useCallback(async (value: DeviceData, systemName: string) => {
        try{
            request(`/api/devices/${systemName}`, TypeRequest.PUT, value, {Authorization: "Bearer " + authData.token})
        }
        catch{}
    },[request, authData])

    useEffect(()=>{
		if (error)
			showSnackbar(error, {}, 10000)
		return ()=>{
	 		clearError();
		}
	},[error, clearError, showSnackbar])

    return {editDevice}
}