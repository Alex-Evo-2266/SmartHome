import { useCallback, useMemo } from "react";
import { DeviceSchema, DeviceSerializeFieldSchema } from "../../../entites/devices";
import { DeviceTypeModel, Room, useRoomAPI } from "../../../entites/rooms";
import { useAppSelector } from "../../../shared/lib/hooks/redux";

export function statusBoolConvert(data: DeviceSerializeFieldSchema): boolean {
    const {value} = data

    if (value === "1" || String(value).toLowerCase() === "true")
        return true;

    // По умолчанию считаем false
    return false;
}

export const boolValDevice = (
    name_device_type: string,
    name_field: string,
    devices_types: Record<string, DeviceTypeModel> | null,
    devices: DeviceSchema[]
): boolean | undefined => {
    // Получаем поля устройства типа LIGHT
    const devices_type_field = devices_types===null?undefined:devices_types[name_device_type]?.fields;
    if (!devices_type_field) return undefined;

    const powerDevices = devices_type_field[name_field]?.devices;
    if (!powerDevices) return false;

    // Создаём множества для быстрого поиска
    const powerSystemNames = new Set(powerDevices.map(d => d.system_name));
    const powerFieldIds = new Set(powerDevices.map(d => d.id_field_device));

    // Фильтруем устройства, которые имеют system_name в списке power
    const relatedDevices = devices.filter(d => powerSystemNames.has(d.system_name));

    // Проверяем каждое устройство
    for (const device of relatedDevices) {
        const fieldStates = device.fields
            ?.filter(f => powerFieldIds.has(f.id))  // только power-поля
            .map(statusBoolConvert);                // конвертируем значение

        if (!fieldStates) continue; // если у устройства нет полей

        // Если хоть одно поле true → есть активный свет
        if (fieldStates.includes(true)) {
            return true;
        }
    }

    // Если ни одно устройство не активно
    return false;
};

export const useBoolRoom = (type: string, field: string, room: Room | null) => {
    const {devicesData} = useAppSelector(state=>state.devices)
    const {roomSetDeviceValue} = useRoomAPI()
    const value = useMemo(()=>boolValDevice(type, field, room?.device_room || null, devicesData),[devicesData, room])

    const click = useCallback(async()=>{
        if(!!room)
            await roomSetDeviceValue(room.name_room, type, field, value?"0":"1")
    },[value, room, type, field])

    return {
        click,
        value
    }
}
