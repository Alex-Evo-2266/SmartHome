import { Card, Switch, Typography } from "alex-evo-sh-ui-kit"
import { capitalizeFirst } from "../../../shared";
import { useNavigate } from 'react-router-dom';
import './RoomPage.scss'
import { DeviceTypeModel, Room, useRoomAPI } from "../../../entites/rooms";
import { useAppSelector } from "../../../shared/lib/hooks/redux";
import { DeviceSchema, DeviceSerializeFieldSchema } from "../../../entites/devices";
import { useCallback, useMemo } from "react";

export interface RoomCardProps{
    children?: React.ReactNode
    room: Room
}

function statusBoolConvert(data: DeviceSerializeFieldSchema): boolean {
    const { value, high, low } = data;

    // Если значение отсутствует, возвращаем false
    if (value == null) return false;

    // Если указано high и текущее значение ему соответствует → true
    if (high != null && value === high) return true;

    // Если указано low и текущее значение ему соответствует → false
    if (low != null && value === low) return false;

    // Если high не указано, пробуем привести значение как булевое (строка "1" или "true")
    if (high == null && (value === "1" || String(value).toLowerCase() === "true"))
        return true;

    // По умолчанию считаем false
    return false;
}

const boolValDevice = (
    name_device_type: string,
    name_field: string,
    devices_types: Record<string, DeviceTypeModel>,
    devices: DeviceSchema[]
): boolean => {
    // Получаем поля устройства типа LIGHT
    const devices_type_field = devices_types[name_device_type]?.fields;
    if (!devices_type_field) return false;

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
export const RoomCard:React.FC<RoomCardProps> = ({children, room}) => {
    const navigate = useNavigate();
    const {roomSetDeviceValue} = useRoomAPI()
    const {devicesData} = useAppSelector(state=>state.devices)
    const light_val = useMemo(()=>boolValDevice("LIGHT", "power", room.device_room, devicesData),[devicesData, room])

    const changeLight = useCallback(async(e:React.ChangeEvent<HTMLInputElement>) => {
        await roomSetDeviceValue(room.name_room, "LIGHT", "power", e.target.checked?"1":"0")
    },[roomSetDeviceValue, room])

    return(
        <Card className="room-card" onClick={()=>navigate(`/room/${room.name_room}`)}>
            <Typography type="title-2">{capitalizeFirst(room.name_room)}</Typography>
            <Typography type="title-1">{room.name_room}</Typography>
            <Switch checked={light_val} onChange={changeLight}/>
            {children}
        </Card>
    )
}