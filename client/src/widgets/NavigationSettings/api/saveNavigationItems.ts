import { useCallback, useEffect } from "react"
import { NavItem } from "../../../features/Navigation"
import { useHttp } from "../../../features/RequestWithAuthentication"
import { useSnackbar } from "../../../shared/lib/hooks/snackbar.hook"
import { TypeRequest } from "../../../shared/api/type"
import { useAppSelector } from "../../../shared/lib/hooks/redux"

export const useSaveNavigationItems = () => {

    const authData = useAppSelector(state=>state.auth)
    const {request, error, clearError} = useHttp()
	const {showSnackbar} = useSnackbar()

    const saveFavouriteItems = useCallback(async(items: NavItem[]) => {
        try{
            await request("/api/users/menu", TypeRequest.PUT, items, {Authorization: "Bearer " + authData.token})
            showSnackbar("navigation save", {}, 10000)
        }
        catch{}
    },[request, showSnackbar])

    useEffect(()=>{
		if (error)
			showSnackbar(error, {}, 10000)
		return ()=>{
			clearError();
		}
	},[error, clearError, showSnackbar])

    return{saveFavouriteItems}
}