import { useCallback, useEffect, useState } from "react"
import { useHttp } from "../../../shared/lib/hooks/http.hook"
import { useSnackbar } from "../../../shared/lib/hooks/snackbar.hook"


export const useToken = (service:string) => {

    const {request, loading, error, clearError} = useHttp()
    const {showSnackbar} = useSnackbar()
    const [token, setToken] = useState<string>("")

    const getToken = useCallback(async(service:string)=>{
        const {token}:{token: string} = await request(`/api-auth/module-service/temp-token?service=${service}`)
        return token
    },[request])

    const loadToken = useCallback(async(service:string)=>{
        const data = await getToken(service)
        setToken(data)
    },[getToken])

    useEffect(()=>{
        loadToken(service)
    },[service, loadToken])

    useEffect(()=>{
        if (error)
            showSnackbar(error, {}, 10000)
        return ()=>{
            clearError();
        }
    },[error, clearError, showSnackbar])

    return {
        getToken,
        token,
        loading
    }
}
