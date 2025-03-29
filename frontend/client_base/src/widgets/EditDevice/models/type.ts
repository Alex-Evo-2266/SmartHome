import { TypeDeviceField } from "../../../entites/devices"

export interface FieldType{
    name_field_type: string
    description?: string
    type_field: TypeDeviceField
    required: boolean
}

export interface DeviceType{
    name: string
    field:{[key:string]:FieldType}
}


export interface TypeFieldEditData {
    name_field_type: string,
    id_field_device: string,
    description?: string,
    field_type: TypeDeviceField,
    required: boolean,
}

export interface DeviceTypeEditData{
    name_type: string
    device: string
    fields: TypeFieldEditData[]
}