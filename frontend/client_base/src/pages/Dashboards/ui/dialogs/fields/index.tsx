import { TypeFieldWidget, WidgetStoreItemSettings } from "@src/entites/dashboard/types/typeData"
import { SettingsFieldText } from "./text"
import { SettingsFieldNumber } from "./number"
import { SettingsFieldBoolean } from "./boolean"
import { SettingsFieldTypeDavice } from "./device_type"

export interface SettingsProps{
    onChange:(value: any, name?: string | undefined)=>void,
    value: string | number | boolean | undefined | object
    settings: WidgetStoreItemSettings
}

export const SettingsField = (props: SettingsProps) => {

    if(props.settings.type === TypeFieldWidget.BASE || props.settings.type === TypeFieldWidget.TEXT)
        return <SettingsFieldText settings={props.settings} value={props.value} onChange={props.onChange}/>
    
    if(props.settings.type === TypeFieldWidget.NUMBER || props.settings.type === TypeFieldWidget.COUNTER)
        return <SettingsFieldNumber settings={props.settings} value={props.value} onChange={props.onChange}/>
    
    if(props.settings.type === TypeFieldWidget.BINARY)
        return <SettingsFieldBoolean settings={props.settings} value={props.value} onChange={props.onChange}/>

    if(props.settings.type === TypeFieldWidget.FOR_DEVICE_TYPE)
        return <SettingsFieldTypeDavice settings={props.settings} value={props.value} onChange={props.onChange}/>
}