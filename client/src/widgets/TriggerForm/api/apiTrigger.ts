import { useCallback, useEffect } from "react"
import { useHttp } from "../../../features/RequestWithAuthentication"
import { useSnackbar } from "../../../shared/lib/hooks/snackbar.hook"
import { TypeRequest } from "../../../shared/api/type"
import { useAppSelector } from "../../../shared/lib/hooks/redux"
import { TriggerData } from "../../../entites/Trigger"

export const useAppTrigger = () => {

    const {request, error, clearError} = useHttp()
	const {showSnackbar} = useSnackbar()
    const authData = useAppSelector(state=>state.auth)

    const addTrigger = useCallback(async (value: TriggerData) => {
        try{
            request(`/api/scripts/triggers`, TypeRequest.POST, value, {Authorization: "Bearer " + authData.token})
        }
        catch{}
    },[request, authData])

    const editTrigger = useCallback(async (value: TriggerData, systemName: string) => {
        try{
            request(`/api/scripts/triggers/${systemName}`, TypeRequest.PUT, value, {Authorization: "Bearer " + authData.token})
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

    return {addTrigger, editTrigger}
}