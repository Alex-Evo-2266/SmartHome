import { WidgetDefinition } from "alex-evo-web-constructor"

export enum TypeFieldWidget{
    BINARY = "binary",
    NUMBER = "number",
    TEXT = "text",
    ENUM = "enum",
    BASE = "base",
    COUNTER = "counter",
    FOR_DEVICE_TYPE = "FOR_DEVICE_TYPE",
}

export type WidgetStoreItemSettingsBase = {
    lable: string
    data_name: string
    readonly?: boolean
}

export type WidgetStoreItemSettingsNumber = WidgetStoreItemSettingsBase & {
    type: TypeFieldWidget.NUMBER | TypeFieldWidget.COUNTER
    sourse: "device" | "room" | "manula" | "binding" | "expression"
    default?: number
}

export type WidgetStoreItemSettingsBinary = WidgetStoreItemSettingsBase & {
    type: TypeFieldWidget.BINARY
    sourse: "device" | "room" | "manula" | "binding"
    default?: boolean
}

export type WidgetStoreItemSettingsText = WidgetStoreItemSettingsBase & {
    type: TypeFieldWidget.TEXT | TypeFieldWidget.BASE
    sourse: "device" | "room" | "manula" | "binding"
    default?: string
}

export type WidgetStoreItemSettingsEnum = WidgetStoreItemSettingsBase &{
    type: TypeFieldWidget.ENUM
    sourse: "device" | "room" | "manula" | "binding"
    default?: string
    enum_values?: string[]
}

export type WidgetStoreItemSettingsDeviceType = WidgetStoreItemSettingsBase &{
    type: TypeFieldWidget.FOR_DEVICE_TYPE
    sourse: "device" | "room"
    device_type?: string
    default?: string
}

export type WidgetStoreItemSettings = 
        WidgetStoreItemSettingsNumber 
        | WidgetStoreItemSettingsBinary 
        | WidgetStoreItemSettingsText 
        | WidgetStoreItemSettingsEnum
        | WidgetStoreItemSettingsDeviceType

export interface WidgetStoreItem extends Omit<WidgetDefinition, "type">{
    id: string
    description?: string
    name: string
    icon?: React.ReactNode
    children?: boolean

    settings?: WidgetStoreItemSettings[]

}
