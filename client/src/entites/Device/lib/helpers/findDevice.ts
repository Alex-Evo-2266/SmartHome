import { DeviceData } from "../..";

export const findDevice = (devices: DeviceData[], systemName: string) => {
    let device = devices.filter(item=>item.system_name === systemName)
    if (device.length > 0)
        return device[0]
    return null
}