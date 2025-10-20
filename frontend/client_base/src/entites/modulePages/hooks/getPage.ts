import { useCallback, useEffect } from "react"
import { useHttp } from "../../../shared/lib/hooks/http.hook"
import { useSnackbar } from "../../../shared/lib/hooks/snackbar.hook"
import { TypeRequest } from "../../../shared/api/type"
import { PageData } from "../models/page"


export const useModulePageAPI = () => {

    const {request, loading, error, clearError} = useHttp()
    const {showSnackbar} = useSnackbar() 

    const getPage = useCallback(async (module:string, page:string):Promise<PageData> => {
        return await request(`/api-pages/pages/${module}/${page}`, TypeRequest.GET)
    },[request])

    useEffect(()=>{
        if (error)
            showSnackbar(error, {}, 10000)
        return ()=>{
            clearError();
        }
    },[error, clearError, showSnackbar])

    return{
        getPage,
        loading
    }
}
