import { useCallback, useEffect } from "react"
import { useHttp } from "../../../features/RequestWithAuthentication"
import { TypeRequest } from "../../../shared/api/type"
import { UpdateUserData } from "../../../entites/User"
import { useSnackbar } from "../../../shared/lib/hooks/snackbar.hook"
import { useAppSelector } from "../../../shared/lib/hooks/redux"

export const useSaveUserData = () => {

    const {request, error, clearError} = useHttp()
    const {showSnackbar} = useSnackbar()
    const authData = useAppSelector(state=>state.auth)

    const saveUserData = useCallback(async(data:UpdateUserData)=>{
        request('/api/users', TypeRequest.PUT, data, {Authorization: "Bearer " + authData.token})
    },[request, authData.token])

    useEffect(()=>{
		if (error)
			showSnackbar(error, {}, 10000)
		return ()=>{
			clearError();
		}
	},[error, clearError, showSnackbar])

    return{
        saveUserData
    }
}