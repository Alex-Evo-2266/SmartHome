import { IOption } from "alex-evo-sh-ui-kit"
import { DeviceSchema, TypeDeviceField } from "../../../entites/devices"
import { DeviceType, DeviceTypeEditData, TypeFieldEditData } from "../models/type"
import { TypeDevice, TypeField } from "../../../entites/devices/models/type"

export function getFieldType(types: DeviceType[], typeName: string) {
    const type = types.find(item => item.name === typeName)
    if(!type)
        return []
    return Object.values(type.field)
}

export function getFieldMap(typeMap: DeviceTypeEditData | null, fieldName: string, device: DeviceSchema){
    const idField = typeMap?.fields.find(item=>item.name_field_type === fieldName)?.id_field_device
    const field = device.fields?.find(item => item.id === idField)?.id
    return field
}

export function getFieldsCondidat(type: TypeDeviceField, device: DeviceSchema):IOption[]{
    const fields = device.fields?.filter(item=>item.type === type)
    const formatType = fields?.map(item=>({
        title: item.name,
        value: item.id
    })) ?? []
    formatType.push({
        value: "",
        title: ""
    })
    return formatType
}

export function getTypeFieldEditData(field: TypeField):TypeFieldEditData {
    return{
        name_field_type: field.name_field_type,
        id_field_device: field.id_field_device,
        description: field.description,
        field_type: field.field_type,
        required: field.required
    }
}

export function getType(type_mask?:TypeDevice):DeviceTypeEditData | null {
    if(!type_mask)
        return null
    return {
        name_type: type_mask.name_type,
        device: type_mask.device,
        fields: type_mask.fields.map(getTypeFieldEditData)
    }
}
