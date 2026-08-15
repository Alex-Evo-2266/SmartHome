import { TypeDeviceField } from "@src/entites/devices"
import { WidgetDefinition } from "alex-evo-web-constructor"

export type WidgetStoreItemSettingsBase = {
    lable: string
    data_name: string
    readonly?: boolean
}

export type WidgetStoreItemSettingsNumber = WidgetStoreItemSettingsBase & {
    type: TypeDeviceField.NUMBER | TypeDeviceField.COUNTER
    sourse: "device" | "room" | "manula" | "binding" | "expression"
    default?: number
}

export type WidgetStoreItemSettingsBinary = WidgetStoreItemSettingsBase & {
    type: TypeDeviceField.BINARY
    sourse: "device" | "room" | "manula" | "binding"
    default?: boolean
}

export type WidgetStoreItemSettingsText = WidgetStoreItemSettingsBase & {
    type: TypeDeviceField.TEXT | TypeDeviceField.BASE
    sourse: "device" | "room" | "manula" | "binding"
    default?: string
}

export type WidgetStoreItemSettingsEnum = WidgetStoreItemSettingsBase &{
    type: TypeDeviceField.ENUM
    sourse: "device" | "room" | "manula" | "binding"
    default?: string
    enum_values?: string[]
}

export type WidgetStoreItemSettings = WidgetStoreItemSettingsNumber | WidgetStoreItemSettingsBinary | WidgetStoreItemSettingsText | WidgetStoreItemSettingsEnum

export interface WidgetStoreItem extends Omit<WidgetDefinition, "type">{
    id: string
    description?: string
    name: string
    icon?: React.ReactNode

    settings?: WidgetStoreItemSettings[]

}
