import { useHttp } from "@src/shared/lib/hooks/http.hook"
import { useSnackbar } from "@src/shared/lib/hooks/snackbar.hook"
import { useCallback, useEffect } from "react"
import { AllModulesData, ModuleData } from "../modules/modules"

export const useModulesAPI = () => {

    const {request, loading, error, clearError} = useHttp()
    const {showSnackbar} = useSnackbar()
    
    const getModulesAll = useCallback(async () => {
        const data: AllModulesData = await request(`/api-modules-manager/modules/all`)
        if(!data)
            return
        return data
    },[request])

    const getModule = useCallback(async (name: string) => {
        const data: ModuleData = await request(`/api-modules-manager/modules/data/${name}`)
        if(!data)
            return
        return data
    },[request])

    const installModule = useCallback(async (name: string) => {
        await request(`/api-modules-manager/modules/install?name=${name}`)
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
        installModule
    }
}