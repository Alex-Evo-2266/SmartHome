import { useCallback, useEffect } from "react"
import { useHttp } from "../../../features/RequestWithAuthentication"
import { TypeRequest } from "../../../shared/api/type"
import { useSnackbar } from "../../../shared/lib/hooks/snackbar.hook"
import { useAppSelector } from "../../../shared/lib/hooks/redux"

export const useGetAutomations = () => {

    const {request, error, clearError, loading} = useHttp()
    const {showSnackbar} = useSnackbar()
    const authData = useAppSelector(state=>state.auth)

    const getAutomations = useCallback(async()=>{
        const data = request('/api/automations', TypeRequest.GET, null, {Authorization: "Bearer " + authData.token})
        return data
    },[request, authData.token])

    const deleteAutomations = useCallback(async(system_name: string)=>{
        await request(`/api/automations/${system_name}`, TypeRequest.DELETE, null, {Authorization: "Bearer " + authData.token})
    },[request, authData.token])

    const setStatusAutomations = useCallback(async(system_name: string, status: boolean)=>{
        await request(`/api/automations/${system_name}`, TypeRequest.PATCH, {status}, {Authorization: "Bearer " + authData.token})
    },[request, authData.token])

    useEffect(()=>{
		if (error)
			showSnackbar(error, {}, 10000)
		return ()=>{
			clearError();
		}
	},[error, clearError, showSnackbar])

    return{
        getAutomations,
        loading,
        deleteAutomations,
        setStatusAutomations
    }
}