import { WidgetStoreItemSettings } from "@src/entites/dashboard/types/typeData"
import { TypeDeviceField } from "@src/entites/devices"
import { SettingsFieldText } from "./text"
import { SettingsFieldNumber } from "./number"
import { SettingsFieldBoolean } from "./boolean"

export interface TextManualProps{
    onChange:(value: any, name?: string | undefined)=>void,
    value: string | number | boolean | undefined | object
    settings: WidgetStoreItemSettings
}

export const SettingsField = (props: TextManualProps) => {

    if(props.settings.type === TypeDeviceField.BASE || props.settings.type === TypeDeviceField.TEXT)
        return <SettingsFieldText settings={props.settings} value={props.value} onChange={props.onChange}/>
    
    if(props.settings.type === TypeDeviceField.NUMBER || props.settings.type === TypeDeviceField.COUNTER)
        return <SettingsFieldNumber settings={props.settings} value={props.value} onChange={props.onChange}/>
    
    if(props.settings.type === TypeDeviceField.BINARY)
        return <SettingsFieldBoolean settings={props.settings} value={props.value} onChange={props.onChange}/>
}