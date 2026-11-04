import { TypeDeviceField } from "@src/entites/devices"
import { useRoom } from "@src/features/Room"
import { useAppSelector } from "@src/shared/lib/hooks/redux"
import { useMemo } from "react"

import {
    ObjectMap,
    ObjectNode,
    UseObjectMapProps
} from "../../../../shared/lib/object-map/types"

/**
 * Создание узла поля устройства.
 */
const createFieldNode = (
    type: TypeDeviceField,
    readonly: boolean
): ObjectNode => ({
    meta: {
        kind: "field",
        type,
        readonly
    }
})

/**
 * Создание узла устройства.
 */
const createDeviceNode = (
    fields: Record<string, ObjectNode>
): ObjectNode => ({
    meta: {
        kind: "object"
    },
    children: fields
})

/**
 * Создание узла комнаты.
 */
const createRoomNode = (
    devices: Record<string, ObjectNode>
): ObjectNode => ({
    meta: {
        kind: "object"
    },
    children: devices
})

export const useObjectMap = ({
    variables = {},
    system = {}
}: UseObjectMapProps = {}): ObjectMap => {

    const { devicesData } = useAppSelector(
        state => state.devices
    )

    const { rooms } = useRoom()

    /**
     * Устройства:
     *
     * device
     * └── lamp_1
     *     ├── state
     *     └── brightness
     */
    const deviceMap = useMemo<ObjectMap>(() => {

        const devices: Record<string, ObjectNode> = {}

        devicesData.forEach(device => {

            const fields: Record<string, ObjectNode> = {}

            device.fields?.forEach(field => {
                fields[field.name] = createFieldNode(
                    field.type,
                    field.read_only
                )
            })

            devices[device.system_name] = createDeviceNode(fields)
        })

        return {
            device: {
                meta: {
                    kind: "namespace"
                },
                children: devices
            }
        }

    }, [devicesData])

    /**
     * Комнаты:
     *
     * room
     * └── kitchen
     *     └── lamp_1
     *         └── state
     */
    const roomMap = useMemo<ObjectMap>(() => {

        const result: Record<string, ObjectNode> = {}

        rooms.forEach(room => {

            const devices: Record<string, ObjectNode> = {}

            for (const deviceName in room.device_room) {

                const roomDevice = room.device_room[deviceName]

                const fields: Record<string, ObjectNode> = {}

                for (const fieldName in roomDevice.fields) {

                    const field = roomDevice.fields[fieldName]

                    fields[fieldName] = createFieldNode(
                        field.field_type,
                        field.readonly
                    )
                }

                devices[deviceName] = createDeviceNode(fields)
            }

            result[room.name_room] = createRoomNode(devices)
        })

        return {
            room: {
                meta: {
                    kind: "namespace"
                },
                children: result
            }
        }

    }, [rooms])

    /**
     * Итоговое дерево объектов.
     */
    return useMemo<ObjectMap>(() => {

        return {
            ...deviceMap,
            ...roomMap,

            variable: {
                meta: {
                    kind: "namespace"
                },
                children: variables
            },

            system: {
                meta: {
                    kind: "namespace"
                },
                children: system
            }
        }

    }, [
        deviceMap,
        roomMap,
        variables,
        system
    ])
}