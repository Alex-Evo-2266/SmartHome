import { useCallback, useEffect } from "react"
import { useHttp } from "../../../features/RequestWithAuthentication"
import { useAppSelector } from "../../../shared/lib/hooks/redux"
import { useSnackbar } from "../../../shared/lib/hooks/snackbar.hook"
import { DeviceAddData } from "../../../entites/Device/models/deviceData"
import { TypeRequest } from "../../../shared/api/type"


export const UseCreateDevice = () => {

    const {request, error, clearError} = useHttp()
	const {showSnackbar} = useSnackbar()
    const authData = useAppSelector(state=>state.auth)

    const addDevice = useCallback(async (value: DeviceAddData) => {
        try{
            return await request(`/api/devices`, TypeRequest.POST, value, {Authorization: "Bearer " + authData.token})
        }
        catch{
        }
    },[request, authData])

    useEffect(()=>{
		if (error)
			showSnackbar(error, {}, 10000)
		return ()=>{
	 		clearError();
		}
	},[error, clearError, showSnackbar])

    return {addDevice}
}