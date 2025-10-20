import { TypeDeviceField } from "./device";

export interface TypeField {
    id: string,
    name_field_type: string,
    id_field_device: string,
    description?: string,
    field_type: TypeDeviceField,
    required: boolean,
    device_type: string       
}

export interface TypeDevice{
    id: string,
    name_type: string,
    fields: TypeField[],
    device: string
    main: boolean
}