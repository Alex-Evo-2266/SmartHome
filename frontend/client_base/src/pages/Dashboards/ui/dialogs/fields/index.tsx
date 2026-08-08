import { WidgetStoreItemSettings } from "@src/entites/dashboard/types/typeData"
import { TypeDeviceField } from "@src/entites/devices"
import { SettingsFieldText } from "./text"

export interface TextManualProps{
    onChange:(value: any, name?: string | undefined)=>void,
    value: string | number | boolean | undefined
    settings: WidgetStoreItemSettings
}

export const SettingsField = (props: TextManualProps) => {

    if(props.settings.type === TypeDeviceField.BASE || props.settings.type === TypeDeviceField.TEXT)
        return <SettingsFieldText settings={props.settings} value={props.value?String(props.value):""} onChange={props.onChange}/>
    
    // if(props.settings.type === TypeDeviceField.)
}