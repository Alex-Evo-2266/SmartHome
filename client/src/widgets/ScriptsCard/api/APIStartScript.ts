import { useCallback, useEffect } from "react"
import { useHttp } from "../../../features/RequestWithAuthentication"
import { useAppSelector } from "../../../shared/lib/hooks/redux"
import { useSnackbar } from "../../../shared/lib/hooks/snackbar.hook"
import { TypeRequest } from "../../../shared/api/type"

export const UseStartScript = () => {

    const {request, error, clearError} = useHttp()
	const {showSnackbar} = useSnackbar()
    const authData = useAppSelector(state=>state.auth)

    const startScript = useCallback(async (system_name: string) => {
        try{
            return await request(`/api/scripts/${system_name}/start`, TypeRequest.GET, null, {Authorization: "Bearer " + authData.token})
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

    return {startScript}
}