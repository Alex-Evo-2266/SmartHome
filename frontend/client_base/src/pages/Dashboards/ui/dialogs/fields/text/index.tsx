import { WidgetStoreItemSettingsText } from "@src/entites/dashboard/types/typeData"
import { TextManual } from "./manual"
import { DeviceSelectField } from "../../selectValue/device"
import { TypeDeviceField } from "@src/entites/devices"
import { RoomObjectSelectField } from "../../selectValue/room"

export interface TextManualProps{
    onChange:(value: any, name?: string | undefined)=>void,
    value: unknown
    settings: WidgetStoreItemSettingsText
}

export const SettingsFieldText = (props: TextManualProps) => {

    const read_only = props.settings.readonly === undefined ? true : props.settings.readonly

    if(props.settings.sourse === "manula")
        return <TextManual {...props} value={String(props.value)}/>

    if(props.settings.sourse === "device")
        return <DeviceSelectField {...props} types={[TypeDeviceField.BASE, TypeDeviceField.TEXT]} readonly={read_only}/>

    if(props.settings.sourse === "room")
        return <RoomObjectSelectField {...props} types={[TypeDeviceField.BASE, TypeDeviceField.TEXT]} readonly={read_only}/>
}