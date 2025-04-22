import { DeviceSchema } from "../../../entites/devices"
import { useGetBinaryFieldControl, useGetNumberFieldControl } from "./fieldControl.hook"

function getField(device: DeviceSchema, nameField: string){
    const typeField = device.type_mask?.fields.find(item=>item.name_field_type === nameField)
    const id_field = typeField?.id_field_device
    if(!id_field)
        return null
    else
        return device.fields?.find(item=>item.id === id_field) ?? null
}

function foo(){}

export const useGetBinaryField = (device: DeviceSchema, nameField: string) => {

    const field = getField(device, nameField)
    
    const control = useGetBinaryFieldControl(field, device.system_name)

    return{
        fieldValue : control?.fieldValue ?? null,
        field,
        updateFieldState : control?.updateFieldState ?? foo,
        changeField : control?.changeField ?? foo,
    }
}

export const useGetNumberField = (device: DeviceSchema, nameField: string) => {

    const field = getField(device, nameField)
    
    const control = useGetNumberFieldControl(field, device.system_name)

    return{
        fieldValue : control?.fieldValue ?? null,
        field,
        updateFieldState : control?.updateFieldState ?? foo,
        changeField : control?.changeField ?? foo,
    }
}