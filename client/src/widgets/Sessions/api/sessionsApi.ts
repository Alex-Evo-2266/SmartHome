import { useCallback, useEffect } from "react"
import { useHttp } from "../../../features/RequestWithAuthentication"
import { TypeRequest } from "../../../shared/api/type"
import { useAppSelector } from "../../../shared/lib/hooks/redux"
import { ISessionResponse } from "../models/session"
import { useSnackbar } from "../../../shared/lib/hooks/snackbar.hook"


export const useSessionsAPI = () => {

	const {request, error, clearError} = useHttp()
	const auth = useAppSelector(state=>state.auth)
	const {showSnackbar} = useSnackbar()

	const getSessions = useCallback(async() => {
		try{
			const data: ISessionResponse[] = await request("/api/users/sessions", TypeRequest.GET, null, {Authorization: `Bearer ${auth.token}`})
			return data
		}
		catch{}
	},[request, auth.token])

	const deleteSessions = useCallback(async(id:number) => {
		try{
			await request(`/api/users/sessions/${id}`, TypeRequest.DELETE, null, {Authorization: `Bearer ${auth.token}`})
		}
		catch{}
	},[request, auth.token])

	useEffect(()=>{
		if (error)
			showSnackbar(error, {}, 10000)
		return ()=>{
	 		clearError();
		}
	},[error, clearError, showSnackbar])

	return{
		getSessions,
		deleteSessions
	}
	
}