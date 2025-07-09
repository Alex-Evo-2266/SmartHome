import { useCallback, useEffect } from "react"
import { useHttp } from "../../../shared/lib/hooks/http.hook"
import { useSnackbar } from "../../../shared/lib/hooks/snackbar.hook"
import { TypeRequest } from "../../../shared/api/type"
import { Script, ScriptCreate, ScriptList } from "../models/script"


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

    const getScript = useCallback(async(id: string)=>{
        const resultData: Script = await request(`/api-scripts/scripts/${id}`, TypeRequest.GET)
        return resultData
    },[request])

    const getScripts = useCallback(async()=>{
        const resultData: ScriptList  = await request('/api-scripts/scripts', TypeRequest.GET)
        return resultData
    },[request])

    const editStatus = useCallback(async(id: string, status: boolean)=>{
        await request(`/api-scripts/scripts/${id}`, TypeRequest.PATCH, {status: status})
    },[request])

    const deleteScript = useCallback(async(id: string)=>{
        await request(`/api-scripts/scripts/${id}`, TypeRequest.DELETE)
    },[request])

    const editScript = useCallback(async(id: string, data: ScriptCreate)=>{
        await request(`/api-scripts/scripts/${id}`, TypeRequest.PUT, {...data})
    },[request])

    const runScript = useCallback(async(id: string)=>{
        await request(`/api-scripts/scripts/run/${id}`, TypeRequest.POST)
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
        getScript,
        getScripts,
        editStatus,
        deleteScript,
        editScript,
        runScript,
        loading
    }
}