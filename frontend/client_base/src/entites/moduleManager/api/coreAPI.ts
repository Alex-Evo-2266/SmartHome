import { useHttp } from "@src/shared/lib/hooks/http.hook"
import { useSnackbar } from "@src/shared/lib/hooks/snackbar.hook"
import { useCallback, useEffect } from "react"

import { CoreContainerData } from "../modules/modules"

export const useCoreAPI = () => {

    const {request, loading, error, clearError} = useHttp()
    const {showSnackbar} = useSnackbar()
    
    const getModulesAll = useCallback(async () => {
        const data: CoreContainerData = await request(`/api-modules-manager/core/all`)
        if(!data)
            return
        return data
    },[request])

    const restartModule = useCallback(async (id: string) => {
        await request(`/api-modules-manager/core/restart/${id}`)
    },[request])
    
    useEffect(()=>{
            if (error)
                showSnackbar(error, {}, 10000)
            return ()=>{
                clearError();
            }
        },[error, clearError, showSnackbar])
    
    return{
        loading,
        getModulesAll,
        restartModule
    }
}