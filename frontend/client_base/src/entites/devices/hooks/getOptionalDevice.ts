import { useCallback, useEffect, useState } from "react"
import { TypeRequest } from "../../../shared/api/type"
import { useHttp } from "../../../shared/lib/hooks/http.hook"
import { useSnackbar } from "../../../shared/lib/hooks/snackbar.hook"
import { DeviceClassOptions } from "../models/option"


export const useGetOptionDevice = () => {

    const {request, loading, error, clearError} = useHttp()
    const {showSnackbar} = useSnackbar()
    const [options, useOptions] = useState<DeviceClassOptions[] | undefined>(undefined)

    const getOptionDevice = useCallback(async () => {
        const {data}:{data:DeviceClassOptions[]} = await request('/api-devices/devices/options', TypeRequest.GET)
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