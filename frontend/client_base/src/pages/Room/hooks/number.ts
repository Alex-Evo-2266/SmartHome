import { useCallback, useMemo } from "react";
import { DeviceSchema, DeviceSerializeFieldSchema } from "../../../entites/devices";
import { DeviceTypeModel, Room, useRoomAPI } from "../../../entites/rooms";
import { useAppSelector } from "../../../shared/lib/hooks/redux";

function toIntOrZero(value: string): number {
    const n = parseInt(value, 10);
    return isNaN(n) ? 0 : n;
}

export function statusNumberConvert(data: DeviceSerializeFieldSchema): number {
    const { value, high, low } = data;
    if(value === undefined || value === null)
        return 0
    let int_value = toIntOrZero(value)
    if(high !== undefined && high !== null)
    {
        const int_high = parseInt(high, 10)
        if(!isNaN(int_high) && int_value > int_high)
            int_value = int_high
    }
    if(low !== undefined && low !== null)
    {
        const int_low = parseInt(low, 10)
        if(!isNaN(int_low) && int_value < int_low)
            int_value = int_low
    }
    return int_value

}

export const numberValDevice = (
    name_device_type: string,
    name_field: string,
    devices_types: Record<string, DeviceTypeModel>,
    devices: DeviceSchema[]
): {val:number | undefined, max: number, min: number} => {
    const devices_type_field = devices_types[name_device_type]?.fields;
    if (!devices_type_field) return {val: undefined, max: 0, min: 0};

    const fieldDevices = devices_type_field[name_field]?.devices;
    if (!fieldDevices) return {val: 0, max: 0, min: 0};

    const powerSystemNames = new Set(fieldDevices.map(d => d.system_name));
    const powerFieldIds = new Set(fieldDevices.map(d => d.id_field_device));

    const relatedDevices = devices.filter(d => powerSystemNames.has(d.system_name));
    
    let buff = {max: Number.MAX_SAFE_INTEGER, min: Number.MIN_SAFE_INTEGER, val: 0}

    for (const device of relatedDevices) {
        const fields = device.fields?.filter(f => powerFieldIds.has(f.id)) 
        const max = Math.max(...(fields?.map(i=>parseInt(i.high || "p",10)).filter(i=>!isNaN(i)) || [Number.MAX_SAFE_INTEGER]))
        const min = Math.min(...(fields?.map(i=>parseInt(i.low || "p",10)).filter(i=>!isNaN(i)) || [Number.MIN_SAFE_INTEGER]))
        const fieldStates = fields?.map(statusNumberConvert);       

        if (!fieldStates) continue; 
        const maxStatus = Math.max(...fieldStates)  

        if(buff.max > max)
            buff.max = max
        if(buff.min < min && min < buff.max)
            buff.min = min
        if(buff.val < maxStatus)
            buff.val = maxStatus

    }
    return buff;
};

export const useNumberRoom = (type: string, field: string, room: Room) => {
    const {devicesData} = useAppSelector(state=>state.devices)
    const {roomSetDeviceValue} = useRoomAPI()
    const {val: value, max, min} = useMemo(()=>numberValDevice(type, field, room.device_room, devicesData),[devicesData, room])

    const change = useCallback(async(val: number)=>{
        await roomSetDeviceValue(room.name_room, type, field, val.toString())
    },[room, type, field])

    const changeHandler = useCallback(async(e: React.ChangeEvent<HTMLInputElement>)=>{
        await roomSetDeviceValue(room.name_room, type, field, e.target.value)
    },[room, type, field])

    return {
        changeHandler,
        change,
        value,
        max, 
        min
    }
}
