import { Range } from "alex-evo-sh-ui-kit"
import "./styleControl.scss"
import { useAppSelector } from "@src/shared/lib/hooks/redux"
import { useContext, useMemo } from "react"
import { WIDTH_PANEL_ITEM } from "@src/entites/dashboard/const"
import { useDebounce } from "@src/shared"
import { ControlTemplate } from "./template"
import { DashboardPageContext } from "@src/entites/dashboard/context"
import { ErrorControl } from "./readonly"
import { ControlElementbase } from "@src/entites/dashboard/models/panel"
import { deviceHooks, parseDataPath, roomHooks } from "./controlUtils"

/**
 * Презентационный компонент слайдера (без логики).
 */
const NumberControlElement = ({
    value,
    onChange,
    title,
    disabled,
    size,
    max = 100,
    min = 0
}: {
    value: number
    onChange: (value: number) => void
    title: string
    size: 1 | 2 | 3 | 4
    min?: number
    max?: number
    disabled?: boolean
}) => {
    const debouncedSend = useDebounce(onChange, 300)

    return (
        <ControlTemplate title={title} size={size}>
            <div
                className="dashboard-control-number-value-range"
                style={{ height: `${WIDTH_PANEL_ITEM - 20}px` }}
            >
                <Range
                    disabled={disabled}
                    colorBg={disabled ? "var(--Outline-color)" : undefined}
                    max={max}
                    min={min}
                    value={value}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        debouncedSend(Number(e.target.value))
                    }
                />
            </div>
        </ControlTemplate>
    )
}

/**
 * Контрол для управления числовым полем устройства.
 */
const NumberControlDevice = ({ data }: { data: ControlElementbase }) => {
    // data.data = "device.system_name.field"
    const [, system_name = "", field_name = ""] = parseDataPath(data.data)

    const { devicesData } = useAppSelector(state => state.devices)
    const device = useMemo(
        () => devicesData.find(i => i.system_name === system_name),
        [system_name, devicesData]
    )
    const field = device?.fields?.find(i => i.name === field_name)

    const { fieldValue, updateFieldState } = deviceHooks["number"](field ?? null, system_name)

    if (!device || !field) return <ErrorControl data={data} />
    return (
        <NumberControlElement
            disabled={device.status !== "online"}
            max={Number(field.high)}
            min={Number(field.low)}
            size={data.width}
            title={data.title}
            onChange={updateFieldState}
            value={fieldValue ?? 0}
        />
    )
}

/**
 * Контрол для управления числовым полем комнаты.
 */
const NumberControlRoom = ({ data }: { data: ControlElementbase }) => {
    // data.data = "room.room_name.deviceType.field"
    const [, room_name = "", typeDevice = "", field = ""] = parseDataPath(data.data)

    const { rooms } = useContext(DashboardPageContext)
    const room = useMemo(() => rooms.find(i => i.name_room === room_name), [rooms])


    const { change, value } = roomHooks["number"](typeDevice, field, room ?? null)

    if (!room) return <ErrorControl data={data} />

    return (
        <NumberControlElement
            title={data.title}
            onChange={change}
            value={value ?? 0}
            size={data.width}
        />
    )
}

/**
 * Универсальный NumberControl.
 * Определяет, к чему относится control: к устройству или комнате.
 */
export const NumberControl = ({ data }: { data: ControlElementbase }) => {
    const [type = ""] = parseDataPath(data.data)

    if (type === "device") return <NumberControlDevice data={data} />
    if (type === "room") return <NumberControlRoom data={data} />

    return <ErrorControl data={data} />
}
