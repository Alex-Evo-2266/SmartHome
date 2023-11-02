import { useCallback, useEffect } from "react";
import { useHttp } from "../../../features/RequestWithAuthentication";
import { useSnackbar } from "../../../shared/lib/hooks/snackbar.hook";
import { TypeRequest } from "../../../shared/api/type";
import { useAppSelector } from "../../../shared/lib/hooks/redux";


export const useLincDeviceAPI = () => {

    const {request, error, clearError} = useHttp()
    const {showSnackbar} = useSnackbar()
    const authData = useAppSelector(state=>state.auth)

    const unlinc = useCallback(async(systemName: string)=>{
        try{
            await request(`/api/devices/${systemName}/polling`, TypeRequest.POST, {status: false}, {Authorization: "Bearer " + authData.token})
        }
        catch{}
    },[request, authData.token])

    const linc = useCallback(async(systemName: string)=>{
        try{
            await request(`/api/devices/${systemName}/polling`, TypeRequest.POST, {status: true}, {Authorization: "Bearer " + authData.token})
        }
        catch{}
    },[request, authData.token])

    useEffect(()=>{
		if (error)
			showSnackbar(error, {}, 10000)
		return ()=>{
			clearError();
		}
	},[error, clearError, showSnackbar])

    return{
        unlinc,
        linc
    }
}