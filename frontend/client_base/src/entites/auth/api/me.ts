import { useCallback, useEffect } from "react"

import { useHttp } from "../../../shared/lib/hooks/http.hook"
import { useSnackbar } from "../../../shared/lib/hooks/snackbar.hook"
import { MeData } from "../models/me"


export const useMeAPI = () => {

    const {request, loading, error, clearError} = useHttp()
    const {showSnackbar} = useSnackbar()

    const getMe = useCallback(async () => {
        try{
            const data:MeData = await request(`/api-auth/sso/me`)
            return data
        } 
        catch{}
    },[request])

    useEffect(()=>{
        if (error)
            showSnackbar(error, {}, 10000)
        return ()=>{
            clearError();
        }
    },[error, clearError, showSnackbar])

    return {
        getMe,
        loading
    }
}