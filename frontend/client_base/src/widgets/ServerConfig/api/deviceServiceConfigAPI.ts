import { useCallback, useEffect } from "react"
import { useHttp } from "../../../shared/lib/hooks/http.hook"
import { useSnackbar } from "../../../shared/lib/hooks/snackbar.hook"
import { ConfigItem } from "../models/config"
import { TypeRequest } from "../../../shared/api/type"

export const useConfigAPI = () => {

    const {request, error, clearError, loading} = useHttp()
    const {showSnackbar} = useSnackbar()

    const getConfig = useCallback(async () => {
        const data:ConfigItem[] = await request("/api-devices/config")
        return data
    },[request])

    const patchConfig = useCallback(async (data: {[key:string]:string}) => {
        await request("/api-devices/config", TypeRequest.PATCH, data)
    },[request])

    useEffect(()=>{
        if (error)
            showSnackbar(error, {}, 10000)
        return ()=>{
            clearError();
        }
    },[error, clearError, showSnackbar])

    return {getConfig, loading, patchConfig}
}