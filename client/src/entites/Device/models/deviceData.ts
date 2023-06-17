
export enum DeviceFieldType{
    BINARY = 'binary',
    NUMBER = 'number',
    TEXT = "text",
    ENUM = "enum",
}

export enum DeviceStatus{
    ONLINE = "online",
    OFFLINE = "offline",
    NOT_SUPORTED = 'not_superted',
    UNLINK = 'nulink'
}

export enum ValueType{
    VALUE = "value",
    JSON = "json"
}

export interface FieldDevice{
    address: string
    control: boolean
    enum_values: string
    high: string
    icon: string
    low: string
    name: string
    type: DeviceFieldType
    unit: string
    value: string
}

export interface DeviceData{
    address: string
    class_device: string
    fields: FieldDevice[]
    information: string
    name: string
    status: DeviceStatus | string
    system_name: string
    token?: string
    type: string
    type_field: any
    value: Dict<string>
    value_type: ValueType | string
}