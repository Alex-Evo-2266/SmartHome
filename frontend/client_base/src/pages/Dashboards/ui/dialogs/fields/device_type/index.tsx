import { WidgetStoreItemSettingsDeviceType } from "@src/entites/dashboard/types/typeData"
import { DeviceSelectForType } from "../../selectValue/deviceForType"


export interface TypeDaviceProps{
    onChange:(value: any, name?: string | undefined)=>void,
    value: unknown
    settings: WidgetStoreItemSettingsDeviceType
}

export const SettingsFieldTypeDavice = (props: TypeDaviceProps) => {

    const read_only = props.settings.readonly === undefined ? true : props.settings.readonly

    if(props.settings.sourse === 'device'){
        return <DeviceSelectForType {...props} readonly={read_only}/>
    }

    if(props.settings.sourse === 'room'){
        
    }

    return null

    
}