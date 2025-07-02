import { useCallback, useEffect } from "react"
import { useHttp } from "../../../shared/lib/hooks/http.hook"
import { useSnackbar } from "../../../shared/lib/hooks/snackbar.hook"
import { TypeRequest } from "../../../shared/api/type"
import { ScriptCreate } from "../models/script"


export const useScriptAPI = () => {


    const {request, loading, error, clearError} = useHttp()
    const {showSnackbar} = useSnackbar()
    
    const createScript = useCallback(async(data: ScriptCreate)=>{
        await request('/api-scripts/scripts', TypeRequest.POST, {...data})
    },[request])

    const scriptCheck = useCallback(async(data: string)=>{
        const resultData = await request('/api-scripts/scripts/check', TypeRequest.POST, {text: data})
        return resultData
    },[request])
    
    useEffect(()=>{
        if (error)
            showSnackbar(error, {}, 10000)
        return ()=>{
            clearError();
        }
    },[error, clearError, showSnackbar])

    return{
        createScript,
        scriptCheck,
        loading
    }
}