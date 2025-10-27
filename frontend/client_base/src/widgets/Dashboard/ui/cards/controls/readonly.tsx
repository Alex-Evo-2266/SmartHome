import { DashboardPageContext } from "@src/entites/dashboard/context"
import { ControlElement } from "@src/entites/dashboard/models/panel"
import { useAppSelector } from "@src/shared/lib/hooks/redux"
import "./styleControl.scss"
import { useContext, useMemo } from "react"

import { deviceHooks, normalizeType, parseDataPath, roomHooks } from "./controlUtils"
import { ControlTemplate } from "./template"

/**
 * UI-компонент для отображения только значения (без управления).
 */
const ReadOnlyControlElement: React.FC<{
    value: number | boolean | string
    title: string
    size: 1 | 2 | 3 | 4
}> = ({ value, title, size }) => (
    <ControlTemplate title={title} size={size}>
        <div className="dashboard-control-number-value readonly">
            {value?.toString() ?? ""}
        </div>
    </ControlTemplate>
)


/**
 * Получение состояния поля устройства.
 */
function useControlDevice(data: string, field_key: "id" | "name" = "name") {
    const [, system_name = "", field_name = ""] = parseDataPath(data)
    const { devicesData } = useAppSelector(state => state.devices)

    const device = useMemo(
        () => devicesData.find(i => i.system_name === system_name),
        [system_name, devicesData]
    )
    const field = device?.fields?.find(i => i[field_key] === field_name)

    const hook = deviceHooks[normalizeType(field?.type)]
    const { fieldValue } = hook(field ?? null, system_name)

    return { device, field, fieldValue }
}

/**
 * ReadOnly для устройства.
 */
const ReadOnlyControlDevice: React.FC<{ data: ControlElement }> = ({ data }) => {
    const { fieldValue } = useControlDevice(data.data)

    return (
        <ReadOnlyControlElement
            title={data.title}
            value={fieldValue ?? ""}
            size={data.width}
        />
    )
}

/**
 * ReadOnly для комнаты.
 * ⚠️ Хук вызывается всегда, даже если room = null (чтобы избежать ошибки React).
 */
const ReadOnlyControlRoom: React.FC<{ data: ControlElement }> = ({ data }) => {
    const [, room_name = "", typeDevice = "", field = ""] = parseDataPath(data.data)
    const { rooms } = useContext(DashboardPageContext)

    const room = useMemo(() => rooms.find(i => i.name_room === room_name), [rooms, room_name])
    const type = room?.device_room[typeDevice].fields[field].field_type

    const hook = roomHooks[normalizeType(type)]
    const { value } = hook(typeDevice, field, room ?? null)

    return (
        <ReadOnlyControlElement
            title={data.title}
            value={value ?? ""}
            size={data.width}
        />
    )
}

/**
 * Заглушка для некорректного конфига.
 */
export const ErrorControl: React.FC<{ data: ControlElement }> = ({ data }) => (
    <ControlTemplate className="undefined-control-container" title={"undefined"} size={data.width}>
        <div className="dashboard-control-number-value readonly undefined-control">
            undefined
        </div>
    </ControlTemplate>
)

/**
 * Универсальный ReadOnly-контрол.
 */
export const ReadOnlyControl: React.FC<{ data: ControlElement }> = ({ data }) => {
    const [type = ""] = parseDataPath(data.data)

    if (type === "device") return <ReadOnlyControlDevice data={data} />
    if (type === "room") return <ReadOnlyControlRoom data={data} />

    return <ErrorControl data={data} />
}
