import { DashboardPageContext, WIDTH_PANEL_ITEM } from "@src/entites/dashboard"
import { ControlElementButton } from "@src/entites/dashboard/models/panel"
import { useAppSelector } from "@src/shared/lib/hooks/redux"
import { getIcons, IconName } from "alex-evo-sh-ui-kit"
import { useCallback, useContext, useMemo } from "react"

import {
    castValue,
    deviceHooks,
    normalizeType,
    parseDataPath,
    roomHooks
} from "./controlUtils"
import { ErrorControl } from "./readonly"
import { ControlTemplate } from "./template"
import "./styleControl.scss"



/**
 * Презентационный компонент кнопки.
 */
const ButtonControlElement = ({
    onClick,
    title,
    size,
    icon,
    disabled = false
}: {
    onClick?: () => void
    title: string
    size: 1 | 2 | 3 | 4,
    icon?: string,
    disabled?: boolean
}) => {

    const Icon = icon? getIcons(icon as IconName): undefined

    return(
    <ControlTemplate onClick={onClick} title={title} size={size}>
        <div
            className={`dashboard-control-bool-1-val-container ${disabled ? "disabled" : ""}`}
            style={{ width: `${WIDTH_PANEL_ITEM - 20}px`, height: `${WIDTH_PANEL_ITEM - 20}px` }}
        >{
            Icon && <Icon primaryColor={"var(--On-primary-container-color)"}/>
        }</div>
    </ControlTemplate>
    )
}

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

    // приводим значение к нужному типу
    const value = castValue(field?.type, rawValue)

    // выбираем правильный хук в зависимости от типа поля
    const hookType = normalizeType(field?.type)
    const { updateFieldState } = deviceHooks[hookType](field ?? null, system_name)

    const click = useCallback(() => updateFieldState(value as never), [value, updateFieldState])

    if (!device || !field) return <ErrorControl data={data} />
    return <ButtonControlElement title={data.title} onClick={click} size={data.width} icon={data.icon}/>
}

/**
 * Вариант кнопки, работающий с комнатой.
 */
const ButtonControlRoom = ({ data }: { data: ControlElementButton }) => {
    // data.data имеет формат: room.room_name.deviceType.field.value
    const [, room_name = "", typeDevice = "", field = "", rawValue = ""] = parseDataPath(data.data)

    const { rooms } = useContext(DashboardPageContext)

    const room = useMemo(() => rooms.find(i => i.name_room === room_name), [rooms, room_name])
    const type = room?.device_room[typeDevice].fields[field].field_type

    const hook = roomHooks[normalizeType(type)]
    const { change } = hook(typeDevice, field, room ?? null)

    const click = useCallback(() => change(castValue(type, rawValue) as never), [type, rawValue, change])

    if (!room) return <ErrorControl data={data} />
    return <ButtonControlElement title={data.title} onClick={click} size={data.width} icon={data.icon}/>
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
