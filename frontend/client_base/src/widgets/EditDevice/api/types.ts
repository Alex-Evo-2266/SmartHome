import { useCallback, useEffect, useState } from "react"
import { TypeRequest } from "../../../shared/api/type"
import { useHttp } from "../../../shared/lib/hooks/http.hook"
import { useSnackbar } from "../../../shared/lib/hooks/snackbar.hook"
import { DeviceType, DeviceTypeEditData } from "../models/type"
import { TypeDevice } from "../../../entites/devices/models/type"


export const useTypeDeviceAPI = () => {

    const {request, loading, error, clearError} = useHttp()
    const {showSnackbar} = useSnackbar()
    const [types, setTypes] = useState<DeviceType[]>([])

    const getAllTypes = useCallback(async () => {
        const data:DeviceType[] = await request(`/api-devices/device-types`, TypeRequest.GET)
        setTypes(data)
        return data
    },[request])

    const getType = useCallback(async (systemName:string) => {
        const data:TypeDevice | null = await request(`/api-devices/device-types/${systemName}`, TypeRequest.GET)
        return data
    },[request])

    const updateTypes = useCallback(async (deviceSystemName:string, body: DeviceTypeEditData | null) => {
        if(!body)
        {
            await deleteTypes(deviceSystemName)
        }
        else{
            await request(`/api-devices/device-types`, TypeRequest.POST, body as any)
        }
    },[request])

    const deleteTypes = useCallback(async (systemName:string) => {
        await request(`/api-devices/device-types/${systemName}`, TypeRequest.DELETE)
    },[request])

    useEffect(()=>{
        getAllTypes()
    },[getAllTypes])

    useEffect(()=>{
        if (error)
            showSnackbar(error, {}, 10000)
        return ()=>{
            clearError();
        }
    },[error, clearError, showSnackbar])

    return{
        getAllTypes,
        loading,
        types,
        deleteTypes,
        updateTypes,
        getType
    }
}