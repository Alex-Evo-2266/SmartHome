import { useCallback } from "react"
import { TypeRequest } from "../../../shared/api/type"
import { useHttp } from "../../../shared/lib/hooks/http.hook"


export const useOptionDevice = () => {

    const {request} = useHttp()

    const getOptionDevice = useCallback(async () => {
        const data = await request('/api-devices/devices/options', TypeRequest.GET)
        console.log(data)
    },[request])

    return{
        getOptionDevice
    }
}