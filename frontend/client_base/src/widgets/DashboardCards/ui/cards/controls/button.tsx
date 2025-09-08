import { ControlElementButton } from "@src/entites/dashboard/models/panel"
import "./styleControl.scss"
import { useAppSelector } from "@src/shared/lib/hooks/redux"
import { useCallback, useContext, useMemo } from "react"
import { ControlTemplate } from "./template"
import { ErrorControl } from "./readonly"
import { DashboardPageContext } from "@src/entites/dashboard"
import {
    castValue,
    deviceHooks,
    normalizeType,
    parseDataPath,
    roomHooks
} from "./controlUtils"

/**
 * Презентационный компонент кнопки.
 */
const ButtonControlElement = ({
    onClick,
    title,
    size
}: {
    onClick?: () => void
    title: string
    size: 1 | 2 | 3 | 4
}) => (
    <ControlTemplate onClick={onClick} title={title} size={size}>
        <button className="dashboard-control-button-1">Click</button>
    </ControlTemplate>
)

/**
 * Вариант кнопки, работающий с конкретным устройством.
 */
const ButtonControlDevice = ({ data }: { data: ControlElementButton }) => {
    // data.data имеет формат: device.system_name.field.value
    const [, system_name = "", field_name = "", rawValue = ""] = parseDataPath(data.data)

    const { devicesData } = useAppSelector(state => state.devices)

    // находим устройство
    const device = useMemo(
        () => devicesData.find(i => i.system_name === system_name),
        [system_name, devicesData]
    )

    // находим поле устройства
    const field = device?.fields?.find(i => i.name === field_name)

    if (!device || !field) return <ErrorControl data={data} />

    // приводим значение к нужному типу
    const value = castValue(field.type, rawValue)

    // выбираем правильный хук в зависимости от типа поля
    const hookType = normalizeType(field.type)
    const { updateFieldState } = deviceHooks[hookType](field, system_name)

    const click = useCallback(() => updateFieldState(value as never), [value])

    return <ButtonControlElement title={data.title} onClick={click} size={data.width} />
}

/**
 * Вариант кнопки, работающий с комнатой.
 */
const ButtonControlRoom = ({ data }: { data: ControlElementButton }) => {
    // data.data имеет формат: room.room_name.deviceType.field.value
    const [, room_name = "", typeDevice = "", field = "", rawValue = ""] = parseDataPath(data.data)

    const { rooms } = useContext(DashboardPageContext)

    const room = useMemo(() => rooms.find(i => i.name_room === room_name), [rooms])
    const type = room?.device_room[typeDevice].fields[field].field_type

    if (!room) return <ErrorControl data={data} />

    const hook = roomHooks[normalizeType(type)]
    const { change } = hook(typeDevice, field, room ?? null)

    const click = () => change(castValue(type, rawValue) as never)

    return <ButtonControlElement title={data.title} onClick={click} size={data.width} />
}

/**
 * Универсальный контроллер кнопки.
 * Определяет, с чем работает кнопка — устройством или комнатой.
 */
export const ButtonControl = ({ data }: { data: ControlElementButton }) => {
    const [type = ""] = parseDataPath(data.data)

    if (type === "device") return <ButtonControlDevice data={data} />
    if (type === "room") return <ButtonControlRoom data={data} />

    return <ErrorControl data={data} />
}
