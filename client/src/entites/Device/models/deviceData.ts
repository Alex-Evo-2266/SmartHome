
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
    read_only: boolean
    enum_values: string
    high: string
    icon: string
    low: string
    name: string
    type: DeviceFieldType
    unit: string
    value: string
    virtual_field: boolean
}

// name: str = ormar.String(max_length=200)
// 	system_name: str = ormar.String(max_length=200, primary_key=True)
// 	class_device: str = ormar.String(max_length=200)
// 	type: str = ormar.String(max_length=200)
// 	address: Optional[str] = ormar.String(max_length=200, nullable=True)
// 	token: Optional[str] = ormar.String(max_length=200, nullable=True)
// 	type_command: ReceivedDataFormat = ormar.String(max_length=200, default=ReceivedDataFormat.JSON)
// 	device_polling: bool = ormar.Boolean(default=True)
// 	device_status: Optional[StatusDevice] = StatusDevice.OFFLINE

export interface DeviceData{
    name: string 
    system_name: string
    class_device: string
    type_field: string
    address: string
    type: string
    token?: string
    device_status: DeviceStatus | string
    fields: FieldDevice[]
    device_polling:boolean
    device_cyclic_polling: boolean
    type_command: ValueType | string
    value: Dict<string>
}

export interface DeviceAddData{
    name: string 
    system_name: string
    class_device: string
    type_field: string
    address?: string
    token?: string
    fields: FieldDevice[]
    type_command: ValueType | string
    type: string
    device_cyclic_polling: boolean
}