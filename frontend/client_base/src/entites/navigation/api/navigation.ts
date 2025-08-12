import { useCallback, useEffect, useState } from "react"
import { useHttp } from "../../../shared/lib/hooks/http.hook"
import { useSnackbar } from "../../../shared/lib/hooks/snackbar.hook"
import { NavigationData, NavigationItem } from "../models/navigation"


export const useNavigation = () => {

    const {request, loading, error, clearError} = useHttp()
    const {showSnackbar} = useSnackbar()

    const getNavigation = useCallback(async()=>{
        const pages:NavigationData = await request('/api-pages/pages/navigations')
        return pages
    },[request])

    useEffect(()=>{
        if (error)
            showSnackbar(error, {}, 10000)
        return ()=>{
            clearError();
        }
    },[error, clearError, showSnackbar])

    return {
        getNavigation,
        loading
    }
}

export const useNavigationData = () => {

    const {getNavigation, loading} = useNavigation()
    const [navigation, setNavigation] = useState<NavigationItem[]>([])
    const [prefix, setPrefix] = useState<string>("")

    const getData = useCallback(async ()=>{
        const data = await getNavigation()
        setNavigation(data.pages)
        setPrefix(data.prefix)
    },[getNavigation])

    useEffect(()=>{
        getData()
    },[getData])

    return {
        getNavigation,
        loading,
        getData,
        navigation,
        prefix
    }
}