import { DeviceSchema, TypeDeviceField } from "@src/entites/devices";
import { DeviceFieldType } from "@src/entites/rooms";

export type ConfigRoomField = {type: TypeDeviceField, enum: string[]; min: number | undefined; max: number | undefined };

export function getConfigRoomField(roomField: DeviceFieldType | null | undefined, devicesData: DeviceSchema[]){
    const initConf = {enum: [], min: NaN, max: NaN, type: TypeDeviceField.TEXT}
    if(!roomField)
    {
        return initConf
    }
    return roomField.devices.reduce<ConfigRoomField>((prev, cur)=>{
        const de = devicesData.find(d=>d.system_name === cur.system_name)
        const f = de?.fields?.find(f=>f.id === cur.id_field_device)
        if(!f)
            return prev
        return {
            enum: [...prev.enum, ...(f.enum_values?.split(",").map(x=>x.trim()) ?? [])], 
            min: Math.min(Number(prev.min), Number(f.low)) , 
            max: Math.max(Number(prev.max), Number(f.high)),
            type: f.type
            }
    },initConf)
}