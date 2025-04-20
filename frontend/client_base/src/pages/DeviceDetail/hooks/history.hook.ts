import { useCallback, useEffect, useState } from "react"
import { useLoadHistory } from "../../../entites/devices/api/loadHistory"
import { DeviceHistory } from "../../../entites/devices/models/history"


export const useDeviceHistory = (systemName:string) => {

    const {loading, getDeviceHistory} = useLoadHistory()
    const [history, setHistory] = useState<DeviceHistory | null>(null)

    const loadHistory = useCallback(async()=>{
        const data = await getDeviceHistory(systemName)
        setHistory(data)
    },[getDeviceHistory, systemName])

    useEffect(()=>{
        loadHistory()
    },[loadHistory])

    return {loading, history}
}