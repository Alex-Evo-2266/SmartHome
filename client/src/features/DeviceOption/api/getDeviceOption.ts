import { useCallback } from "react"
import { requestWithRefrash } from "../../../shared/api/baseAPI"
import { TypeRequest } from "../../../shared/api/type"
import { useAppDispatch, useAppSelector } from "../../../shared/lib/hooks/redux"
import { useSnackbar } from "../../../shared/lib/hooks/snackbar.hook"
import { LoginData, login, logout } from "../../../entites/User"
import { IDeviceOptionResponse, mapResponseOptionDevice } from ".."

export const useDeviceOption = () => {

    const auth = useAppSelector(state=>state.auth)
    const dispatch = useAppDispatch()
    const {showSnackbar} = useSnackbar()

    const requestError = useCallback((error: string) => {
		showSnackbar(error, {}, 10000)
	},[showSnackbar])

    const getDevicesOption = useCallback(async() => {
        try{
            const data:IDeviceOptionResponse[] = await requestWithRefrash(
                "/api/devices/options", 
                TypeRequest.GET, 
                null, 
                auth.token, 
                {}, 
                ()=>dispatch(logout()),
                (data:LoginData)=>dispatch(login(data.token, data.id, data.role, new Date(data.expires_at)))
            )
            return data.map(item=>mapResponseOptionDevice(item)) 
        }
        catch(e){
            if(typeof e === "string")
                requestError(e)
            else if(e instanceof Error)
                requestError(e.message)
        }
    },[requestError, dispatch, auth.token])

    const getDeviceOption = useCallback(async(className:string) => {
        const options = await getDevicesOption()
        if (!options)
            return null
        const condidat = options.filter(item=>item.className===className)
        if(condidat.length > 0)
            return condidat[0]
        return null
    },[getDevicesOption])

    return{getDeviceOption, getDevicesOption}
}