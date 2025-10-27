import { useCallback, useMemo } from "react";

import { DeviceSchema } from "../../../entites/devices";
import { DeviceTypeModel, Room, useRoomAPI } from "../../../entites/rooms";
import { useAppSelector } from "../../../shared/lib/hooks/redux";

export const textValDevice = (
    name_device_type: string,
    name_field: string,
    devices_types: Record<string, DeviceTypeModel> | null,
    devices: DeviceSchema[]
): string => {
    const devices_type_field = devices_types===null?undefined:devices_types[name_device_type]?.fields;
    if (!devices_type_field) return "";

    const fieldDevices = devices_type_field[name_field]?.devices;
    if (!fieldDevices) return "";

    const powerSystemNames = new Set(fieldDevices.map(d => d.system_name));
    const powerFieldIds = new Set(fieldDevices.map(d => d.id_field_device));

    const relatedDevices = devices.filter(d => powerSystemNames.has(d.system_name));
    
    let buff = ""

    for (const device of relatedDevices) {
        const fields = device.fields?.filter(f => powerFieldIds.has(f.id)) 
        const fieldStates = fields?.map(i=>i.value).filter(i=>i!== undefined && i !== null);       

        if (!fieldStates) continue; 
        const maxStatus = fieldStates.reduce((max, current) => 
            current.length > max.length ? current : max,
            ""
            );

        if(buff.length < maxStatus.length)
            buff = maxStatus

    }
    return buff;
};

export const useTextRoom = (type: string, field: string, room: Room | null) => {
    const {devicesData} = useAppSelector(state=>state.devices)
    const {roomSetDeviceValue} = useRoomAPI()
    const value = useMemo(()=>textValDevice(type, field, room?.device_room ?? null, devicesData),[devicesData, room, field, type])

    const change = useCallback(async(val: string)=>{
        if(room)
            await roomSetDeviceValue(room.name_room, type, field, val.toString())
    },[room, type, field, roomSetDeviceValue])

    const changeHandler = useCallback(async(e: React.ChangeEvent<HTMLInputElement>)=>{
        if(room)
            await roomSetDeviceValue(room.name_room, type, field, e.target.value)
    },[room, type, field, roomSetDeviceValue])

    return {
        changeHandler,
        change,
        value
    }
}
