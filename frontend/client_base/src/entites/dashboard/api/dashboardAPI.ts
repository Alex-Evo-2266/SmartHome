import { useHttp } from "@src/shared/lib/hooks/http.hook"
import { useSnackbar } from "@src/shared/lib/hooks/snackbar.hook"
import { useCallback, useEffect } from "react"
import { Dashboard, Dashboards } from "../models/panel"
import { TypeRequest } from "@src/shared/api/type"


export const useDashboardAPI = () => {

    const {request, loading, error, clearError} = useHttp()
    const {showSnackbar} = useSnackbar()
    
    const getDashboardsAll = useCallback(async () => {
        const data:Dashboards = await request(`/api-pages/dashboard`)
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

    const setUserDashboard = useCallback(async (ids: string[]) => {
        await request(`/api-pages/user-dashboard/set`, TypeRequest.POST, {dashboards: ids})
    },[request])

    const getUserDashboard = useCallback(async () => {
        const data: Dashboards = await request(`/api-pages/user-dashboard`, TypeRequest.GET)
        if(!data)
            return
        return data.dashboards
    },[request])

    const getDashboardsAllType = useCallback(async () => {
        const data1:Dashboards = await request(`/api-pages/dashboard`)
        const data2: Dashboards = await request(`/api-pages/user-dashboard`)
        return [data1?.dashboards ?? [], data2?.dashboards ?? []]
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
        setUserDashboard,
        getUserDashboard,
        getDashboardsAllType,
        loading
    }
}