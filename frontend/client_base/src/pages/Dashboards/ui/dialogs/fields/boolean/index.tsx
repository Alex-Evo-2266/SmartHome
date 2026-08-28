import { WidgetStoreItemSettingsBinary } from "@src/entites/dashboard/types/typeData"
import { BooleanManual } from "./manual"
import { DeviceSelectField } from "../../selectValue/deviceField"
import { TypeDeviceField } from "@src/entites/devices"
import { RoomObjectSelectField } from "../../selectValue/room"

export interface BooleanManualProps{
    onChange:(value: any, name?: string | undefined)=>void,
    value: unknown
    settings: WidgetStoreItemSettingsBinary
}

export const SettingsFieldBoolean = (props: BooleanManualProps) => {

    const read_only = props.settings.readonly === undefined ? true : props.settings.readonly

    if(props.settings.sourse === "manula")
        return <BooleanManual {...props} value={String(props.value)}/>

    if(props.settings.sourse === "device")
        return <DeviceSelectField {...props} types={[TypeDeviceField.BINARY]} readonly={read_only}/>

    if(props.settings.sourse === "room")
        return <RoomObjectSelectField {...props} types={[TypeDeviceField.BINARY]} readonly={read_only}/>
}