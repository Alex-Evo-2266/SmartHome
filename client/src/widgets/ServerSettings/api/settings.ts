import { useCallback, useEffect } from "react"
import { useHttp } from "../../../features/RequestWithAuthentication"
import { useAppSelector } from "../../../shared/lib/hooks/redux"
import { useSnackbar } from "../../../shared/lib/hooks/snackbar.hook"
import { TypeRequest } from "../../../shared/api/type"
import { ResponseData } from "../models/serverConfig"

export const useServerSettingsApi = () => {

    const authData = useAppSelector(state=>state.auth)
    const {request, error, clearError} = useHttp()
	const {showSnackbar} = useSnackbar()

    const getServerSettings = useCallback(async() => {
        const data:ResponseData = await request('/api/server/config', TypeRequest.GET, undefined, {Authorization: "Bearer " + authData.token})
        return data
    },[request])

    const setServerSettings = useCallback(async(data:Dict<Dict<string>>) => {
        await request('/api/server/config', TypeRequest.PUT, {moduleConfig: data}, {Authorization: "Bearer " + authData.token})
        showSnackbar("save server settings", {}, 5000)
    },[request])

    useEffect(()=>{
		if (error)
			showSnackbar(error, {}, 10000)
		return ()=>{
			clearError();
		}
	},[error, clearError, showSnackbar])

    return{
        getServerSettings,
        setServerSettings
    }
}