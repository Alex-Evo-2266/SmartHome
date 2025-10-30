import { useCallback } from "react"

import { useAppDispatch } from "./redux"
import { IOptionSnackbar, hideSnackbar, showSnackbar } from "../reducers/snackbarReducer"


export const useSnackbar = () => {

    const dispatch = useAppDispatch()

    const hide = useCallback(() => {
        dispatch(hideSnackbar())
    },[dispatch])

    const show = useCallback((text:string, option?: IOptionSnackbar, delay?:number)=>{
        dispatch(showSnackbar(text, option))
        if(!option?.closeButton || delay)
        {
            setTimeout(()=>{
                dispatch(hideSnackbar())
            },delay ?? 10000)
        }
    },[dispatch])

    return {showSnackbar: show, hideSnackbar: hide}
}