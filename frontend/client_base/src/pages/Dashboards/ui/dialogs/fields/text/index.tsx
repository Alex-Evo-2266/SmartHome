import { WidgetStoreItemSettingsText } from "@src/entites/dashboard/types/typeData"
import { TextManual } from "./manual"
import { DeviceSelectField } from "../../selectValue/device"
import { TypeDeviceField } from "@src/entites/devices"
// import { TextDevice } from "./device"

export interface TextManualProps{
    onChange:(value: any, name?: string | undefined)=>void,
    value: string
    settings: WidgetStoreItemSettingsText
}

export const SettingsFieldText = (props: TextManualProps) => {

    if(props.settings.sourse === "manula")
        return <TextManual {...props}/>

    if(props.settings.sourse === "device")
        return <DeviceSelectField {...props} types={[TypeDeviceField.BASE, TypeDeviceField.TEXT]}/>
}