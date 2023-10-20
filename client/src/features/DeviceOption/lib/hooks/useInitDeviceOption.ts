import { useCallback } from "react"
import { useAppDispatch } from "../../../../shared/lib/hooks/redux"
import { setDeviceOptions } from "../reducers/deviceOptionReducer"
import { useDeviceOptionAPI } from "../../api/getDeviceOption"


export const useInitDeviceOption = () => {

    const {getDevicesOption} = useDeviceOptionAPI()
    const dispatch = useAppDispatch()

    const initDeviceOption = useCallback(async() => {
        const options = await getDevicesOption()
        dispatch(setDeviceOptions(options ?? []))
    },[getDevicesOption, dispatch])

    return { initDeviceOption }
}