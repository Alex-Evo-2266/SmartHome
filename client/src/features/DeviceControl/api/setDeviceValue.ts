import { useCallback } from "react"
import { requestWithRefrash } from "../../../shared/api/baseAPI"
import { TypeRequest } from "../../../shared/api/type"
import { useAppDispatch, useAppSelector } from "../../../shared/lib/hooks/redux"
import { LoginData, login, logout } from "../../../entites/User"

export const useControlDeviceAPI = () => {

    const auth = useAppSelector(state=>state.auth)
    const dispatch = useAppDispatch()

    const setValueDevice = useCallback(async(systemName:string, field:string, value: string)=>{
        await requestWithRefrash(
            `/api/devices/${systemName}/value/${field}/set/${value}`, 
            TypeRequest.GET, 
            null, 
            auth.token, 
            {},
            ()=>dispatch(logout()),
			(data:LoginData)=>dispatch(login(data.token, data.id, data.role, new Date(data.expires_at)))
        )
    },[auth.token, dispatch])

    return{setValueDevice}
}