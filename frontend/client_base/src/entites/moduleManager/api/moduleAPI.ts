import { TypeRequest } from "@src/shared/api/type"
import { useHttp } from "@src/shared/lib/hooks/http.hook"
import { useSnackbar } from "@src/shared/lib/hooks/snackbar.hook"
import { useCallback, useEffect } from "react"

import { AllModulesData, ModuleData } from "../modules/modules"

export const useModulesAPI = () => {

    const {request, loading, error, clearError} = useHttp()
    const {showSnackbar} = useSnackbar()
    
    const getModulesAll = useCallback(async (no_cash:boolean =false) => {
        const data: AllModulesData = await request(`/api-modules-manager/modules/all?no_cash=${no_cash}`)
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

    const runModule = useCallback(async (name: string, container?: string) => {
        if(container){
            await request(`/api-modules-manager/modules/run?name=${name}&container_name=${container}`)
        }
        await request(`/api-modules-manager/modules/run?name=${name}`)
    },[request])

    const stopModule = useCallback(async (name: string, container?: string) => {
        if(container){
            await request(`/api-modules-manager/modules/stop?name=${name}&container_name=${container}`)
        }
        else{
            await request(`/api-modules-manager/modules/stop?name=${name}`)
        }
    },[request])

    const deleteModule = useCallback(async (name: string) => {
        await request(`/api-modules-manager/modules/${name}`, TypeRequest.DELETE)
    },[request])

    const rebuildModule = useCallback(async (name: string) => {
        await request(`/api-modules-manager/modules/build?name=${name}`)
    },[request])

    const updateModule = useCallback(async (name: string) => {
        await request(`/api-modules-manager/modules/update?name=${name}`)
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
        runModule,
        stopModule,
        deleteModule,
        rebuildModule,
        updateModule
    }
}