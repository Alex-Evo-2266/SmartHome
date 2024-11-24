import { useCallback, useEffect, useState } from "react"
import { TypeRequest } from "../../../shared/api/type"
import { useHttp } from "../../../shared/lib/hooks/http.hook"
import { DeviceClassOptions } from "../models/options"
import { useSnackbar } from "../../../shared/lib/hooks/snackbar.hook"


export const useGetOptionDevice = () => {

    const {request, loading, error, clearError} = useHttp()
    const {showSnackbar} = useSnackbar()
    const [options, useOptions] = useState<DeviceClassOptions[] | undefined>(undefined)

    const getOptionDevice = useCallback(async () => {
        const data:DeviceClassOptions[] = await request('/api-devices/devices/options', TypeRequest.GET)
        console.log(data)
        useOptions(data)
    },[request])

    useEffect(()=>{
        getOptionDevice()
    },[getOptionDevice])

    useEffect(()=>{
		if (error)
			showSnackbar(error, {}, 10000)
		return ()=>{
			clearError();
		}
	},[error, clearError, showSnackbar])

    return{
        getOptionDevice,
        options,
        loading
    }
}