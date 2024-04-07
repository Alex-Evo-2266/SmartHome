import { useCallback, useEffect } from "react"
import { useHttp } from "../../../features/RequestWithAuthentication"
import { TypeRequest } from "../../../shared/api/type"
import { useSnackbar } from "../../../shared/lib/hooks/snackbar.hook"
import { useAppSelector } from "../../../shared/lib/hooks/redux"
import { AutomationData } from "../../../entites/Automation"

export const useGetAutomations = () => {

    const {request, error, clearError, loading} = useHttp()
    const {showSnackbar} = useSnackbar()
    const authData = useAppSelector(state=>state.auth)

    const getAutomation = useCallback(async(system_name:string)=>{
        const data = request(`/api/automations/${system_name}?get_or_none=true`, TypeRequest.GET, null, {Authorization: "Bearer " + authData.token})
        return data
    },[request, authData.token])

    const editOrCreateAutomation = useCallback(async (value: AutomationData, systemName: string) => {
        try{
            request(`/api/automations/${systemName}?updata_or_create=true`, TypeRequest.PUT, value, {Authorization: "Bearer " + authData.token})
        }
        catch{}
    },[request, authData])

    const deleteAutomation = useCallback(async (systemName: string) => {
        try{
            request(`/api/automations/${systemName}`, TypeRequest.DELETE, null, {Authorization: "Bearer " + authData.token})
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

    return{
        getAutomation,
        loading,
        editOrCreateAutomation,
        deleteAutomation
    }
}