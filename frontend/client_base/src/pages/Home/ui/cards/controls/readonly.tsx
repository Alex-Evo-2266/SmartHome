import { ControlElement, TypeControlElements } from "../../../../../entites/dashboard/models/panel"
import './styleControl.scss'
import { useGetBinaryFieldControl, useGetEnumFieldControl, useGetNumberFieldControl, useGetTextFieldControl } from "../../../../../features/Device"
import { useAppSelector } from "../../../../../shared/lib/hooks/redux"
import { useContext, useMemo } from "react"
import { useBoolRoom, useNumberRoom, useTextRoom } from "../../../../../features/Room"
import { HomePageContext } from "../../../context"
import { ControlTemplate } from "./template"

interface ReadOnlyControlElementProps{
    value: number | boolean | string
    title: string
    size: 1 | 2 | 3 | 4
}

const ReadOnlyControlElement:React.FC<ReadOnlyControlElementProps> = ({value, title, size}) => {

    return(
        <ControlTemplate title={title} size={size}>
            <div className="dashboard-control-number-value readonly">
                {value.toString()}
            </div>
        </ControlTemplate>
    )
}

interface ReadOnlyControlDeviceProps{
    data: ControlElement
}

const configDeviceHooks = {
    bool: {hook: useGetBinaryFieldControl},
    number: {hook: useGetNumberFieldControl},
    text: {hook: useGetTextFieldControl},
    enum: {hook: useGetEnumFieldControl}
}

const useControlDevice = (type: TypeControlElements, data: string, field_key: "id" | "name" = "name") => {
    const system_name = data.split(".")[1] ?? ""
    const field_name = data.split(".")[2] ?? ""
    const {devicesData} = useAppSelector(state=>state.devices)
    const device = useMemo(()=>devicesData.find(i=>i.system_name === system_name), [system_name, devicesData])
    const field = device?.fields?.find(i=>i[field_key] === field_name)

    const hook = configDeviceHooks[type].hook

    const {fieldValue} = hook(field ?? null, system_name)

    return{
        system_name,
        field_name,
        device: device ?? null,
        field,
        fieldValue
    }
}

const ReadOnlyControlDevice: React.FC<ReadOnlyControlDeviceProps> = ({ data }) => {
    const {fieldValue} = useControlDevice(data.type, data.data);

    if(fieldValue === null || fieldValue === undefined)
        return (
            <ReadOnlyControlElement title={data.title} value={""} size={data.width}/>
        )

    return (
        <ReadOnlyControlElement title={data.title} value={fieldValue} size={data.width}/>
    )
};

const configRoomHooks = {
    bool: {hook: useBoolRoom},
    number: {hook: useNumberRoom},
    text: {hook: useTextRoom},
    enum: {hook: useTextRoom}
}

const ReadOnlyControlRoom: React.FC<ReadOnlyControlDeviceProps> = ({ data }) => {
    const room_name = data.data.split(".")[1] ?? ""
    const typeDevice = data.data.split(".")[2] ?? ""
    const field = data.data.split(".")[3] ?? ""
    const {rooms} = useContext(HomePageContext)
    const room = useMemo(()=>rooms.find(i=>i.name_room===room_name),[rooms])
    const hook = configRoomHooks[data.type].hook
    const {value} = hook(typeDevice, field, room ?? null)

    return (
        <ReadOnlyControlElement title={data.title} value={value ?? false} size={data.width}/>
    )
};


interface ReadOnlyControlProps{
    data: ControlElement
}

export const ErrorControl:React.FC<ReadOnlyControlProps> = ({data}) => {
    return(
        <ControlTemplate className="undefined-control-container" title={"undefined"} size={data.width}>
            <div className="dashboard-control-number-value readonly undefined-control">
                undefined
            </div>
        </ControlTemplate>
    )
}

export const ReadOnlyControl:React.FC<ReadOnlyControlProps> = ({data}) => {
    const type = data.data.split(".")[0] ?? ""

    if(type === "device")
        return <ReadOnlyControlDevice data={data}/>
    if(type === 'room')
        return <ReadOnlyControlRoom data={data}/>

    return(<ErrorControl data={data}/>)
}

