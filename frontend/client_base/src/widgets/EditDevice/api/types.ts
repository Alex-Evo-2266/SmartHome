import { useCallback, useEffect, useState } from "react"

import { TypeDevice } from "../../../entites/devices/models/type"
import { TypeRequest } from "../../../shared/api/type"
import { useHttp } from "../../../shared/lib/hooks/http.hook"
import { useSnackbar } from "../../../shared/lib/hooks/snackbar.hook"
import { DeviceType, DeviceTypeEditData } from "../models/type"


export const useTypeDeviceAPI = () => {

    const {request, loading, error, clearError} = useHttp()
    const {showSnackbar} = useSnackbar()
    const [types, setTypes] = useState<DeviceType[]>([])

    const getAllTypes = useCallback(async () => {
        const {data}:{data:DeviceType[]} = await request(`/api-devices/device-types`, TypeRequest.GET)
        setTypes(data)
        return data
    },[request])

    const getType = useCallback(async (systemName:string) => {
        const data:{data:TypeDevice[]} = await request(`/api-devices/device-types/${systemName}`, TypeRequest.GET)
        return data.data
    },[request])

    const getTypeMain = useCallback(async (systemName:string) => {
        const data:TypeDevice | null = await request(`/api-devices/device-types/${systemName}/main`, TypeRequest.GET)
        return data
    },[request])

    const setTypeMain = useCallback(async (systemName:string, id:string) => {
        await request(`/api-devices/device-types/${systemName}/main`, TypeRequest.PATCH, {id})
    },[request])

    const deleteTypes = useCallback(async (id:string) => {
        await request(`/api-devices/device-types/${id}`, TypeRequest.DELETE)
    },[request])

    const updateTypes = useCallback(async (id:string, body: DeviceTypeEditData | null) => {
        if(!body)
        {
            await deleteTypes(id)
        }
        else{
            await request(`/api-devices/device-types/${id}`, TypeRequest.PUT, body as unknown as Dict<unknown> )
        }
    },[request, deleteTypes])

    const createTypes = useCallback(async (body: DeviceTypeEditData) => {
        await request(`/api-devices/device-types`, TypeRequest.POST, body as unknown as Dict<unknown>)
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
        getType,
        getTypeMain,
        createTypes,
        setTypeMain
    }
}