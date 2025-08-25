import { Range } from "alex-evo-sh-ui-kit"
import { ControlElementNumberControl } from "../../../../../entites/dashboard/models/panel"
import './styleControl.scss'
import { useGetNumberFieldControl } from "../../../../../features/Device"
import { useAppSelector } from "../../../../../shared/lib/hooks/redux"
import { useContext, useMemo } from "react"
import { WIDTH_PANEL_ITEM } from "../../../const"
import { useDebounce } from "../../../../../shared"
import { ControlTemplate } from "./template"
import { HomePageContext } from "../../../context"
import { useNumberRoom } from "../../../../../features/Room"
import { ErrorControl } from "./readonly"

interface NumberControlElementProps{
    value: number
    onChange: (value:number)=>void
    title: string
    size: 2 | 3 | 4,
    min?: number,
    max?: number
    disabled?: boolean
}

const NumberControlElement:React.FC<NumberControlElementProps> = ({value, onChange, title, disabled, size, max = 100, min = 0}) => {

    const debouncedSend = useDebounce(onChange, 300)

    return(
        <ControlTemplate title={title} size={size}>
            <div className={`dashboard-control-number-value-range`} style={{height: `${WIDTH_PANEL_ITEM - 20}px`}}>
                <Range disabled={disabled} colorBg={disabled?"var(--Outline-color)":undefined} max={max} min={min} value={value} onChange={(e:React.ChangeEvent<HTMLInputElement>)=>debouncedSend(Number(e.target.value))}/>
            </div>
        </ControlTemplate>
    )
}

interface NumberControlDeviceProps{
    data: ControlElementNumberControl
}

const useControlDevice = (data: string, field_key: "id" | "name" = "name") => {
    const system_name = data.split(".")[1] ?? ""
    const field_name = data.split(".")[2] ?? ""
    const {devicesData} = useAppSelector(state=>state.devices)
    const device = useMemo(()=>devicesData.find(i=>i.system_name === system_name), [system_name, devicesData])
    const field = device?.fields?.find(i=>i[field_key] === field_name)

    const {fieldValue, changeField, updateFieldState} = useGetNumberFieldControl(field ?? null, system_name)

    return{
        system_name,
        field_name,
        device: device ?? null,
        field,
        fieldValue,
        changeField,
        updateFieldState
    }
}

const NumberControlDevice: React.FC<NumberControlDeviceProps> = ({ data }) => {
    const {fieldValue, updateFieldState, field, device} = useControlDevice(data.data)

    if(!field || !device)
        return <ErrorControl data={data}/>

    return (
        <NumberControlElement disabled={device.status !== "online"} max={Number(field.high)} min={Number(field.low)} size={data.width} title={data.title} onChange={updateFieldState} value={fieldValue ?? 0}/>
    )
};

const NumberControlRoom: React.FC<NumberControlDeviceProps> = ({ data }) => {
    const room_name = data.data.split(".")[1] ?? ""
    const typeDevice = data.data.split(".")[2] ?? ""
    const field = data.data.split(".")[3] ?? ""
    const {rooms} = useContext(HomePageContext)
    const room = useMemo(()=>rooms.find(i=>i.name_room===room_name),[rooms])
    const {change, value} = useNumberRoom(typeDevice, field, room ?? null)

    if(room === undefined)
        return <ErrorControl data={data}/>

    return (
        <NumberControlElement title={data.title} onChange={change} value={value ?? 0} size={data.width}/>
    )
};

interface NumberControlProps{
    data: ControlElementNumberControl
}

export const NumberControl:React.FC<NumberControlProps> = ({data}) => {
    const type = data.data.split(".")[0] ?? ""

    if(type === "device")
        return <NumberControlDevice data={data}/>
    if(type === 'room')
        return <NumberControlRoom data={data}/>

    return <ErrorControl data={data}/>
}

