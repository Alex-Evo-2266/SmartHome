import { DeviceSchema } from "../models/device"

export function getDeviceInStore(devcies: DeviceSchema[], systemName: string | undefined){
    if(!systemName){
        return undefined
    }
    return devcies.find(item=>item.system_name===systemName)
}