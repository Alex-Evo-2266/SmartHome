import { StatusDevice, TypeDeviceField } from "./device"

export interface FieldHistoryItem{
    id:string
    datatime: string
    value:string
    status: StatusDevice
}

export interface FieldHistory {
    field_id: string
    name: string
    low?: string
    high?: string
    type: TypeDeviceField
    data: FieldHistoryItem[]
}

export interface DeviceHistory {
    system_name: string
    data: FieldHistory[]
}