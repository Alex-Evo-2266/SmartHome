import { WidgetStoreItemSettingsNumber } from "@src/entites/dashboard/types/typeData"
import { NumberManual } from "./manual"
import { DeviceSelectField } from "../../selectValue/deviceField"
import { TypeDeviceField } from "@src/entites/devices"
import { RoomObjectSelectField } from "../../selectValue/room"

export interface TextManualProps{
    onChange:(value: any, name?: string | undefined)=>void,
    value: unknown
    settings: WidgetStoreItemSettingsNumber
}

export const SettingsFieldNumber = (props: TextManualProps) => {

    const read_only = props.settings.readonly === undefined ? true : props.settings.readonly

    if(props.settings.sourse === "manula")
        return <NumberManual {...props} value={String(props.value)}/>

    if(props.settings.sourse === "device")
        return <DeviceSelectField {...props} types={[TypeDeviceField.COUNTER, TypeDeviceField.NUMBER]} readonly={read_only}/>

    if(props.settings.sourse === "room")
        return <RoomObjectSelectField {...props} types={[TypeDeviceField.COUNTER, TypeDeviceField.NUMBER]} readonly={read_only}/>
}