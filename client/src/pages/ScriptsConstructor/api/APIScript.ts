import { useCallback, useEffect } from "react"
import { useHttp } from "../../../features/RequestWithAuthentication"
import { useSnackbar } from "../../../shared/lib/hooks/snackbar.hook"
import { TypeRequest } from "../../../shared/api/type"
import { useAppSelector } from "../../../shared/lib/hooks/redux"
import { Script } from "../../../entites/Script"

export const useAPIScript = () => {

    const {request, error, clearError} = useHttp()
	const {showSnackbar} = useSnackbar()
    const authData = useAppSelector(state=>state.auth)

    const addScript = useCallback(async (value: Script) => {
        try{
            await request(`/api/scripts`, TypeRequest.POST, value, {Authorization: "Bearer " + authData.token})
        }
        catch{}
    },[request, authData])

    const getScript = useCallback(async (system_name: string) => {
        try{
            return await request(`/api/scripts/${system_name}`, TypeRequest.GET, null, {Authorization: "Bearer " + authData.token})
        }
        catch{}
    },[request, authData])

    const editScript = useCallback(async (value: Script, systemName: string) => {
        try{
            request(`/api/scripts/${systemName}`, TypeRequest.PUT, value, {Authorization: "Bearer " + authData.token})
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

    return {addScript, getScript, editScript}
}