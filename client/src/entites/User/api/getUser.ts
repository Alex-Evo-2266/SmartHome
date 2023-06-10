import { useCallback } from "react"
import { requestWithRefrash } from "../../../shared/api/baseAPI"
import { TypeRequest } from "../../../shared/api/type"
import { useAppDispatch, useAppSelector } from "../../../shared/lib/hooks/redux"
import { LoginData, login, logout } from ".."
import { UserDataResponse } from "../model/user"
import { mapUserData } from "../lib/helpers/mapUserData"
import { useSnackbar } from "../../../shared/lib/hooks/snackbar.hook"

export const useUserAPI = () => {

    const auth = useAppSelector(state=>state.auth)
    const dispatch = useAppDispatch()
    const {showSnackbar} = useSnackbar()

    const requestError = useCallback((error: string) => {
		showSnackbar(error, {}, 10000)
	},[showSnackbar])

    const userInit = useCallback(async() => {
        try{
            const data:UserDataResponse = await requestWithRefrash(
                "/api/users", 
                TypeRequest.GET, 
                null, 
                auth.token, 
                {}, 
                ()=>dispatch(logout()),
                (data:LoginData)=>dispatch(login(data.token, data.id, data.role, new Date(data.expires_at)))
            )
            return mapUserData(data)
        }
        catch(e){
            if(typeof e === "string")
                requestError(e)
            else if(e instanceof Error)
                requestError(e.message)
        }
    },[requestError, dispatch])

    

    return {userInit}
}
