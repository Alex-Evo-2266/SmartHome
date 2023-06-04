import { useCallback } from "react"
import { useAppDispatch, useAppSelector } from "../../../shared/lib/hooks/redux"
import { useSnackbar } from "../../../shared/lib/hooks/snackbar.hook"
import { TypeRequest } from "../../../shared/api/type"
import { NavItem } from ".."
import { requestWithRefrash } from "../../../shared/api/baseAPI"
import { LoginData, login, logout } from "../../../entites/User"


export const useNavigationAPI = () => {

	const authData = useAppSelector(state=>state.auth)
	const {showSnackbar} = useSnackbar()
	const dispatch = useAppDispatch()

	const getAllNavigationItem = useCallback(async() => {
		try{
			let data: NavItem[] = await requestWithRefrash('/api/users/menu/all')
			return data
		}
		catch(e){
			if(typeof e === "string")
				requestError(e)
			else if(e instanceof Error)
				requestError(e.message)
		}
	},[])

	const getUserNavigationItem = useCallback(async() => {
		try{
			let data: NavItem[] = await requestWithRefrash(
				'/api/users/menu', 
				TypeRequest.GET, 
				null, 
				authData.token, 
				{}, 
				()=>dispatch(logout()),
				(data:LoginData)=>dispatch(login(data.token, data.id, data.role, new Date(data.expires_at)))
			)
			return data
		}
		catch(e){
			if(typeof e === "string")
				requestError(e)
			else if(e instanceof Error)
				requestError(e.message)
		}
    },[authData.token])

	function requestError(error: string)
	{
		showSnackbar(error, {}, 10000)
	}

	return{
		getAllNavigationItem,
		getUserNavigationItem
	}
}