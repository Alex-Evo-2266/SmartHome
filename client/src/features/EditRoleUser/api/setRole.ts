import { useCallback } from "react"
import { INewRole } from "../models/updateRole"
import { useAppDispatch, useAppSelector } from "../../../shared/lib/hooks/redux"
import { useSnackbar } from "../../../shared/lib/hooks/snackbar.hook"
import { TypeRequest } from "../../../shared/api/type"
import { requestWithRefrash } from "../../../shared/api/baseAPI"
import { LoginData, login, logout } from "../../../entites/User"
import { mapPutUserRoleData } from "../lib/helpers/mapPutUserRoleData"

export const useUpdateRole = () => {

    const authData = useAppSelector(state=>state.auth)
	const {showSnackbar} = useSnackbar()
	const dispatch = useAppDispatch()

	const requestError = useCallback((error: string) => {
		showSnackbar(error, {}, 10000)
	},[showSnackbar])

    const updateRole = useCallback(async(data: INewRole) => {
        try{
			await requestWithRefrash(
				'/api/users/level', 
				TypeRequest.PUT, 
				mapPutUserRoleData(data), 
				authData.token, 
				{}, 
				()=>dispatch(logout()),
				(data:LoginData)=>dispatch(login(data.token, data.id, data.role, new Date(data.expires_at)))
			)
		}
		catch(e){
			if(typeof e === "string")
				requestError(e)
			else if(e instanceof Error)
				requestError(e.message)
		}
    },[authData.token, requestError, dispatch])

    return{
        updateRole
    }
}