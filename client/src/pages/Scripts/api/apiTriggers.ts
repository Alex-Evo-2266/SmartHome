import { useCallback, useEffect } from "react"
import { useHttp } from "../../../features/RequestWithAuthentication"
import { TypeRequest } from "../../../shared/api/type"
import { useSnackbar } from "../../../shared/lib/hooks/snackbar.hook"
import { useAppSelector } from "../../../shared/lib/hooks/redux"

export const useGetTriggers = () => {

    const {request, error, clearError, loading} = useHttp()
    const {showSnackbar} = useSnackbar()
    const authData = useAppSelector(state=>state.auth)

    const getTriggers = useCallback(async()=>{
        const data = request('/api/scripts/triggers', TypeRequest.GET, null, {Authorization: "Bearer " + authData.token})
        return data
    },[request, authData.token])

    const deleteTriggers = useCallback(async(system_name: string)=>{
        await request(`/api/scripts/triggers/${system_name}`, TypeRequest.DELETE, null, {Authorization: "Bearer " + authData.token})
    },[request, authData.token])

    useEffect(()=>{
		if (error)
			showSnackbar(error, {}, 10000)
		return ()=>{
			clearError();
		}
	},[error, clearError, showSnackbar])

    return{
        getTriggers,
        loading,
        deleteTriggers
    }
}