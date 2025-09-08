import { ControlElementBool } from "@src/entites/dashboard/models/panel"
import './styleControl.scss'
import { useAppSelector } from "@src/shared/lib/hooks/redux"
import { useCallback, useContext, useMemo } from "react"
import { ControlTemplate } from "./template"
import { ErrorControl } from "./readonly"
import { WIDTH_PANEL_ITEM } from "@src/entites/dashboard/const"
import { DashboardPageContext } from "@src/entites/dashboard"
import { useGetBinaryFieldControl } from "@src/features/Device"
import { useBoolRoom } from "@src/features/Room"
import { parseDataPath } from "./controlUtils"

const BoolControlElement = ({ value, onClick, title, size, disabled }: {
    value: boolean
    onClick?: () => void
    title: string
    size: 1 | 2 | 3 | 4
    disabled?: boolean
}) => (
    <ControlTemplate onClick={onClick} title={title} size={size}>
        <div
            className={`dashboard-control-bool-1-val-container ${value ? "action" : ""} ${disabled ? "disabled" : ""}`}
            style={{ width: `${WIDTH_PANEL_ITEM - 20}px`, height: `${WIDTH_PANEL_ITEM - 20}px` }}
        />
    </ControlTemplate>
)

const BoolControlDevice = ({ data }: { data: ControlElementBool }) => {
    const [, system_name = "", field_name = ""] = parseDataPath(data.data)
    const { devicesData } = useAppSelector(state => state.devices)
    const device = useMemo(() => devicesData.find(i => i.system_name === system_name), [system_name, devicesData])
    const field = device?.fields?.find(i => i.name === field_name)

    const { fieldValue, updateFieldState } = useGetBinaryFieldControl(field ?? null, system_name)

    const click = useCallback(() => updateFieldState(!fieldValue), [fieldValue])

    if (!device || !field)
        return <ErrorControl data={data} />

    return (
        <BoolControlElement
            disabled={device.status !== "online"}
            title={data.title}
            onClick={click}
            value={fieldValue ?? false}
            size={data.width}
        />
    )
}

const BoolControlRoom = ({ data }: { data: ControlElementBool }) => {
    const [, room_name = "", typeDevice = "", field = ""] = parseDataPath(data.data)
    const { rooms } = useContext(DashboardPageContext)
    const room = useMemo(() => rooms.find(i => i.name_room === room_name), [rooms])
    const { click, value } = useBoolRoom(typeDevice, field, room ?? null)

    if (!room)
        return <ErrorControl data={data} />

    return (
        <BoolControlElement
            title={data.title}
            onClick={click}
            value={value ?? false}
            size={data.width}
        />
    )
}

export const BoolControl = ({ data }: { data: ControlElementBool }) => {
    const [type = ""] = parseDataPath(data.data)

    if (type === "device") return <BoolControlDevice data={data} />
    if (type === "room") return <BoolControlRoom data={data} />

    return <ErrorControl data={data} />
}
