import { useCallback, useMemo } from "react";

import { DeviceSchema, DeviceSerializeFieldSchema } from "../../../entites/devices";
import { DeviceTypeModel, Room, useRoomAPI } from "../../../entites/rooms";
import { useAppSelector } from "../../../shared/lib/hooks/redux";

/**
 * Конвертация строкового значения поля устройства в булево.
 * "1" и "true" → true, всё остальное → false.
 */
export function statusBoolConvert(data: DeviceSerializeFieldSchema): boolean {
  const { value } = data;
  return value === "1" || String(value).toLowerCase() === "true";
}

/**
 * Проверяет, есть ли среди связанных устройств активное (true) значение.
 *
 * @param name_device_type - тип устройства (например LIGHT)
 * @param name_field - поле (например "power")
 * @param devices_types - описание типов устройств
 * @param devices - список устройств
 * @returns true, если хотя бы одно устройство активно
 */
export const boolValDevice = (
  name_device_type: string,
  name_field: string,
  devices_types: Record<string, DeviceTypeModel> | null,
  devices: DeviceSchema[]
): boolean | undefined => {
  const devices_type_field = devices_types?.[name_device_type]?.fields;
  if (!devices_type_field) return undefined;

  const powerDevices = devices_type_field[name_field]?.devices;
  if (!powerDevices) return false;

  const powerSystemNames = new Set(powerDevices.map(d => d.system_name));
  const powerFieldIds = new Set(powerDevices.map(d => d.id_field_device));

  const relatedDevices = devices.filter(d =>
    powerSystemNames.has(d.system_name)
  );

  for (const device of relatedDevices) {
    const fieldStates = device.fields
      ?.filter(f => powerFieldIds.has(f.id))
      .map(statusBoolConvert);

    if (fieldStates?.includes(true)) {
      return true;
    }
  }

  return false;
};

/**
 * Хук для управления булевыми полями комнаты (например включение света).
 *
 * @param type - тип устройства
 * @param field - имя поля
 * @param room - объект комнаты
 */
export const useBoolRoom = (type: string, field: string, room: Room | null) => {
  const { devicesData } = useAppSelector(state => state.devices);
  const { roomSetDeviceValue } = useRoomAPI();

  const name_room = room?.name_room ?? "";
  const device_room = room?.device_room ?? null;

  const value = useMemo(
    () => boolValDevice(type, field, device_room, devicesData),
    [devicesData, device_room, type, field]
  );

  const click = useCallback(async () => {
    if (name_room) {
      await roomSetDeviceValue(name_room, type, field, value ? "0" : "1");
    }
  }, [value, name_room, type, field, roomSetDeviceValue]);

  const change = useCallback(
    async (val: boolean) => {
      if (name_room) {
        await roomSetDeviceValue(name_room, type, field, val ? "1" : "0");
      }
    },
    [name_room, type, field, roomSetDeviceValue]
  );

  return {
    click,
    change,
    value
  };
};
