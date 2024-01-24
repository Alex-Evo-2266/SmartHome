import { useCallback, useEffect } from "react"
import { useHttp } from "../../../features/RequestWithAuthentication"
import { useSnackbar } from "../../../shared/lib/hooks/snackbar.hook"
import { TypeRequest } from "../../../shared/api/type"
import { useAppSelector } from "../../../shared/lib/hooks/redux"
import { AutomationData } from "../../../entites/Automation"

export const useAppAutomation = () => {

    const {request, error, clearError} = useHttp()
	const {showSnackbar} = useSnackbar()
    const authData = useAppSelector(state=>state.auth)

    const addAutomation = useCallback(async (value: AutomationData) => {
        try{
            request(`/api/automations`, TypeRequest.POST, value, {Authorization: "Bearer " + authData.token})
        }
        catch{}
    },[request, authData])

    const editAutomation = useCallback(async (value: AutomationData, systemName: string) => {
        try{
            request(`/api/automations/${systemName}`, TypeRequest.PUT, value, {Authorization: "Bearer " + authData.token})
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

    return {addAutomation, editAutomation}
}