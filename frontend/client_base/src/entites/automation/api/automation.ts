import { useCallback, useEffect } from "react"
import { useHttp } from "../../../shared/lib/hooks/http.hook"
import { useSnackbar } from "../../../shared/lib/hooks/snackbar.hook"
import {Automation} from "../models/automation"
import { TypeRequest } from "../../../shared/api/type"

export const useAutomationAPI = () => {

    const {request, loading, error, clearError} = useHttp()
    const {showSnackbar} = useSnackbar()

    const getAutomationAll = useCallback(async()=>{
        const data: Automation[] = await request('/api-devices/automation')
        return data
    },[request])

    const getAutomation = useCallback(async(name:string)=>{
        const data: Automation = await request(`/api-devices/automation/${name}`)
        return data
    },[request])

    const deleteAutomation = useCallback(async(name:string)=>{
        await request(`/api-devices/automation/${name}`, TypeRequest.DELETE)
    },[request])

    const addAutomation = useCallback(async(automation:Automation)=>{
        await request(`/api-devices/automation`, TypeRequest.POST, {...automation})
    },[request])

    const editAutomation = useCallback(async(name:string, automation:Automation)=>{
        await request(`/api-devices/automation/${name}`, TypeRequest.PUT, {...automation})
    },[request])

    const enableAutomation = useCallback(async(name:string, enabled:boolean)=>{
        await request(`/api-devices/automation/${name}`, TypeRequest.PATCH, {is_enabled: enabled})
    },[request])

    useEffect(()=>{
            if (error)
                showSnackbar(error, {}, 10000)
            return ()=>{
                clearError();
            }
        },[error, clearError, showSnackbar])

    return {
        getAutomationAll,
        getAutomation,
        deleteAutomation,
        addAutomation,
        editAutomation,
        enableAutomation,
        loading,
    }
}