import { useCallback, useEffect } from "react"
import { TypeDeviceField } from "@src/entites/devices"
import { IcreateRuntime } from "../helpers/dashboardRegistary"

interface RoomDevice {
    system_name: string
    id_field_device: string
}

export const useDashboardRuntime = (
    runtime: IcreateRuntime,
    devicesData: any[],
    rooms: any[],
) => {
    const getValueRoomDevice = useCallback(
        (
            devices: RoomDevice[],
            type: TypeDeviceField,
        ) => {
            const deviceNames = new Set(
                devices.map((device) => device.system_name),
            )

            const fieldIds = new Set(
                devices.map((device) => device.id_field_device),
            )

            const fields = devicesData
                .filter((device) => deviceNames.has(device.system_name))
                .flatMap((device) => device.fields ?? [])
                .filter((field) => fieldIds.has(field.id))

            if (
                type === TypeDeviceField.TEXT ||
                type === TypeDeviceField.BASE ||
                type === TypeDeviceField.ENUM
            ) {
                return fields[0]?.value ?? ""
            }

            if (type === TypeDeviceField.BINARY) {
                return fields.some((field) =>
                    [true, "true", 1, "1"].includes(field.value),
                )
            }

            if (
                type === TypeDeviceField.NUMBER ||
                type === TypeDeviceField.COUNTER
            ) {
                const values = fields
                    .map((field) => Number(field.value))
                    .filter((value) => !Number.isNaN(value))

                return values.length > 0
                    ? Math.max(...values)
                    : 0
            }

            return undefined
        },
        [devicesData],
    )

    useEffect(() => {
        for (const room of rooms) {
            for (const deviceKey in room.device_room) {
                const device = room.device_room[deviceKey]

                for (const fieldKey in device.fields) {
                    const field = device.fields[fieldKey]

                    const value = getValueRoomDevice(
                        field.devices,
                        field.field_type,
                    )

                    runtime.store.set(
                        `rooms.${room.name_room}.${deviceKey}.${fieldKey}`,
                        value,
                    )
                }
            }
        }

        for (const device of devicesData) {
            for (const field of device.fields ?? []) {
                runtime.store.set(
                    `devices.${device.system_name}.${field.id}`,
                    field.value,
                )
            }
        }
    }, [
        devicesData,
        rooms,
        runtime,
        getValueRoomDevice,
    ])
}