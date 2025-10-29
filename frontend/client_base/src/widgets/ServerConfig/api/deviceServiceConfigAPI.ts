import { useCallback, useEffect } from "react"

import { TypeRequest } from "../../../shared/api/type"
import { useHttp } from "../../../shared/lib/hooks/http.hook"
import { useSnackbar } from "../../../shared/lib/hooks/snackbar.hook"
import { ConfigItem } from "../models/config"

export const useConfigAPI = (preffix: string) => {

    const {request, error, clearError, loading} = useHttp()
    const {showSnackbar} = useSnackbar()

    const getConfig = useCallback(async () => {
        const data:ConfigItem[] = await request(`${preffix}/config`)
        return data
    },[request])

    const patchConfig = useCallback(async (data: {[key:string]:string}) => {
        await request(`${preffix}/config`, TypeRequest.PATCH, data)
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