import { ControlElementBool } from "../../../../entites/dashboard/models/panel"
import './styleControl.scss'
import { useGetBinaryFieldControl } from "../../../../features/Device"
import { useAppSelector } from "../../../../shared/lib/hooks/redux"
import { useCallback, useContext, useMemo } from "react"
import { useBoolRoom } from "../../../../features/Room"
import { HomePageContext } from "../../context"
import { ControlTemplate } from "./template"
import { WIDTH_PANEL_ITEM } from "../../const"

interface BoolControlElementProps{
    value: boolean
    onClick?: ()=>void
    title: string
    size: 1 | 2
}

const BoolControlElement:React.FC<BoolControlElementProps> = ({value, onClick, title, size}) => {

    return(
        <ControlTemplate onClick={onClick} title={title} size={size}>
            <div className={`dashboard-control-bool-1-val-container ${value?"action":""}`} style={{width: `${WIDTH_PANEL_ITEM - 20}px`, height: `${WIDTH_PANEL_ITEM - 20}px`}}>
            </div>
        </ControlTemplate>
    )
}

interface BoolControlDeviceProps{
    data: ControlElementBool
}

const useControlDevice = (data: string, field_key: "id" | "name" = "name") => {
    const system_name = data.split(".")[1] ?? ""
    const field_name = data.split(".")[2] ?? ""
    const {devicesData} = useAppSelector(state=>state.devices)
    const device = useMemo(()=>devicesData.find(i=>i.system_name === system_name), [system_name, devicesData])
    const field = device?.fields?.find(i=>i[field_key] === field_name)

    const {fieldValue, changeField, updateFieldState} = useGetBinaryFieldControl(field ?? null, system_name)

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

const BoolControlDevice: React.FC<BoolControlDeviceProps> = ({ data }) => {
    const {fieldValue, updateFieldState} = useControlDevice(data.data);

    const click = useCallback(()=>{
        updateFieldState(!fieldValue)
    },[fieldValue])

    if (data.readonly) {
        return (
            <BoolControlElement title={data.title} value={fieldValue ?? false} size={data.width}/>
        );
    }

    return (
        <BoolControlElement title={data.title} onClick={click} value={fieldValue ?? false} size={data.width}/>
    )
};

const BoolControlRoom: React.FC<BoolControlDeviceProps> = ({ data }) => {
    const room_name = data.data.split(".")[1] ?? ""
    const typeDevice = data.data.split(".")[2] ?? ""
    const field = data.data.split(".")[3] ?? ""
    const {rooms} = useContext(HomePageContext)
    const room = useMemo(()=>rooms.find(i=>i.name_room===room_name),[rooms])
    const {click, value} = useBoolRoom(typeDevice, field, room ?? null)

    if (data.readonly) {
        return (
            <BoolControlElement title={data.title} value={value ?? false} size={data.width}/>
        );
    }

    return (
        <BoolControlElement title={data.title} onClick={click} value={value ?? false} size={data.width}/>
    )
};


interface BoolControlProps{
    data: ControlElementBool
}

export const BoolControl:React.FC<BoolControlProps> = ({data}) => {
    const type = data.data.split(".")[0] ?? ""

    if(type === "device")
        return <BoolControlDevice data={data}/>
    if(type === 'room')
        return <BoolControlRoom data={data}/>

    return null
}

