import { useHttp } from "@src/shared/lib/hooks/http.hook"
import { useSnackbar } from "@src/shared/lib/hooks/snackbar.hook"
import { useCallback, useEffect } from "react"
import { Dashboard, Dashboards } from "../models/panel"
import { TypeRequest } from "@src/shared/api/type"


export const useDashboardAPI = () => {

    const {request, loading, error, clearError} = useHttp()
    const {showSnackbar} = useSnackbar()
    
    const getDashboardsAll = useCallback(async (id: string) => {
        const data:Dashboards = await request(`/api-pages/dashboard/${id}`)
        if(!data)
            return
        return data.dashboards
    },[request])

    const getDashboard = useCallback(async (id: string) => {
        const data:Dashboard = await request(`/api-pages/dashboard/${id}`)
        return data
    },[request])

    const createDashboard = useCallback(async (data: Dashboard) => {
        await request(`/api-pages/dashboard`, TypeRequest.POST, {...data})
    },[request])

    const updateDashboard = useCallback(async (id: string, data: Dashboard) => {
        await request(`/api-pages/dashboard/${id}`, TypeRequest.PUT, {...data})
    },[request])

    const deleteDashboard = useCallback(async (id: string) => {
        await request(`/api-pages/dashboard/${id}`, TypeRequest.DELETE)
    },[request])
    
    useEffect(()=>{
            if (error)
                showSnackbar(error, {}, 10000)
            return ()=>{
                clearError();
            }
        },[error, clearError, showSnackbar])
    
    return{
        getDashboardsAll,
        getDashboard,
        createDashboard,
        updateDashboard,
        deleteDashboard,
        loading
    }
}