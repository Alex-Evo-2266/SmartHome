import { DeviceHistory } from "../../../entites/devices/models/history"


export function getFieldHistory(data:DeviceHistory | null, field_id:string | null){
    if(data === null || field_id === null)
        return null
    return data.data.find(item=>item.field_id === field_id) ?? null
}