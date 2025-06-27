import { TypeDeviceField } from "../../../entites/devices"


export type FieldData = {
    name: string
    address: string
    type: TypeDeviceField
    low?: string,
    high?: string,
    read_only: boolean,
    unit: string,
    virtual_field: boolean
    enum_values?: string
    icon?: string
}

export type EditDeviceData = {
    name: string
    system_name: string
    address?: string
    token?: string
    type_get_data?: 'pull' | 'push'
    type_command?: string
    fields: FieldData[]
    room?: string
}

export type EditDeviceDataSendSchema = {
    name: string
    system_name: string
    address?: string
    token?: string
    type_get_data?: 'pull' | 'push'
    type_command?: string
    fields: FieldData[]
    class_device: string
    type: string
}