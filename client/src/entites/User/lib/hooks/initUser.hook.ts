import { useCallback } from "react"
import { useUserAPI } from "../../api/getUser"
import { useAppDispatch } from "../../../../shared/lib/hooks/redux"
import { setUserData } from "../.."


export const useInitUser = () => {

    const {userInit} = useUserAPI()
    const dispatch = useAppDispatch()

    const init = useCallback(async() => {
        const data = await userInit()
        if(data)
            dispatch(setUserData(data))
    },[userInit])

    return{userInit: init}
}