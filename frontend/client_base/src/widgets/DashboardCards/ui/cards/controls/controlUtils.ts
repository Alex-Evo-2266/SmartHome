import { TypeDeviceField } from "@src/entites/devices"
import {
    useGetBinaryFieldControl,
    useGetEnumFieldControl,
    useGetNumberFieldControl,
    useGetTextFieldControl
} from "@src/features/Device"
import { useBoolRoom, useNumberRoom, useTextRoom } from "@src/features/Room"

/**
 * Разбирает строку пути данных (data.data).
 *
 * Пример:
 * - "device.system_name.field.value" → ["device", "system_name", "field", "value"]
 * - "room.room_name.deviceType.field.value" → ["room", "room_name", "deviceType", "field", "value"]
 *
 * @param path Строка пути
 * @returns Массив частей пути
 */
export function parseDataPath(path: string): string[] {
    return path.split(".")
}

/**
 * Нормализует тип поля устройства для дальнейшего выбора хука.
 *
 * @param type Тип из перечисления TypeDeviceField
 * @returns Один из ключей "bool" | "number" | "enum" | "text"
 */
export function normalizeType(type?: TypeDeviceField): "bool" | "number" | "enum" | "text" {
    switch (type) {
        case TypeDeviceField.BINARY:
            return "bool"
        case TypeDeviceField.NUMBER:
            return "number"
        case TypeDeviceField.ENUM:
            return "enum"
        default:
            return "text"
    }
}

/**
 * Приводит строковое значение к корректному типу
 * в зависимости от поля устройства.
 *
 * @param type Тип поля устройства
 * @param value Строка для преобразования
 * @returns Приведённое значение (boolean | number | string)
 */
export function castValue(type: TypeDeviceField | undefined, value: string): boolean | number | string {
    if (type === TypeDeviceField.BINARY) return value.toLowerCase() === "true"
    if (type === TypeDeviceField.NUMBER) return Number(value)
    return value
}

/**
 * Карта хуков для работы с полями устройств.
 * Используется при типе "device".
 */
export const deviceHooks = {
    bool: useGetBinaryFieldControl,
    number: useGetNumberFieldControl,
    text: useGetTextFieldControl,
    enum: useGetEnumFieldControl
}

/**
 * Карта хуков для работы с полями комнат.
 * Используется при типе "room".
 * ⚠️ enum обрабатывается как text.
 */
export const roomHooks = {
    bool: useBoolRoom,
    number: useNumberRoom,
    text: useTextRoom,
    enum: useTextRoom
}
