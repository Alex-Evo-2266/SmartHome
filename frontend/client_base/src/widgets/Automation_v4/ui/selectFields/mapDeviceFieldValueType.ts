import type { ExpressionValueType } from "@src/entites/automation_v4"
import { TypeDeviceField } from "@src/entites/devices"

const deviceTypeMap: Partial<Record<TypeDeviceField, ExpressionValueType>> = {
    [TypeDeviceField.NUMBER]: "number",
    [TypeDeviceField.COUNTER]: "number",
    [TypeDeviceField.BINARY]: "boolean",
    [TypeDeviceField.TEXT]: "string",
    [TypeDeviceField.ENUM]: "string",
    [TypeDeviceField.BASE]: "string"
}

export const mapDeviceFieldValueType = (
    type: TypeDeviceField | undefined
): ExpressionValueType | undefined => {

    if (!type) return undefined

    return deviceTypeMap[type]
}