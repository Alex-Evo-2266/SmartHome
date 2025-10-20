import { useHttp } from "@src/shared/lib/hooks/http.hook"
import { useSnackbar } from "@src/shared/lib/hooks/snackbar.hook"
import { useCallback, useEffect } from "react"
import { AllModulesData, ModuleData } from "../modules/modules"
import { TypeRequest } from "@src/shared/api/type"

export const useCoreModulesAPI = () => {

    const {request, loading, error, clearError} = useHttp()
    const {showSnackbar} = useSnackbar()
    
    const getModulesAll = useCallback(async (no_cash:boolean =false) => {
        const data: AllModulesData = await request(`/api-modules-manager/modules-core/all?no_cash=${no_cash}`)
        if(!data)
            return
        return data
    },[request])

    const getModule = useCallback(async (name: string) => {
        const data: ModuleData = await request(`/api-modules-manager/modules-core/data/${name}`)
        if(!data)
            return
        return data
    },[request])

    const installModule = useCallback(async (name: string) => {
        await request(`/api-modules-manager/modules-core/install?name=${name}`)
    },[request])

    const deleteModule = useCallback(async (name: string) => {
        await request(`/api-modules-manager/modules-core/${name}`, TypeRequest.DELETE)
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
        getModule,
        installModule,
        deleteModule
    }
}