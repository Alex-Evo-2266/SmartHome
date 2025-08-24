import { Range, Typography } from "alex-evo-sh-ui-kit"
import { ControlElementNumber } from "../../../../entites/dashboard/models/panel"
import './styleControl.scss'
import { useGetNumberFieldControl } from "../../../../features/Device"
import { useAppSelector } from "../../../../shared/lib/hooks/redux"
import { useMemo } from "react"
import { SIZE1_ITEM_WIDTH, SIZE2_ITEM_WIDTH, SIZE_ITEM_HEIGHT } from "../../const"
import { useDebounce } from "../../../../shared"

interface BoolControlElementProps{
    value: number
    onChange: (value:number)=>void
    title: string
    size: 1 | 2,
    min?: number,
    max?: number
}

const NumberControlElement:React.FC<BoolControlElementProps> = ({value, onChange, title, size, max = 100, min = 0}) => {

    const debouncedSend = useDebounce(onChange, 300)

    return(
        <div className={`dashboard-control-number-1 ${value?"action":undefined}`} style={{width: size === 1?SIZE1_ITEM_WIDTH:SIZE2_ITEM_WIDTH, height: SIZE_ITEM_HEIGHT}}>
            <Range max={max} min={min} value={value} onChange={(e:React.ChangeEvent<HTMLInputElement>)=>debouncedSend(Number(e.target.value))}/>
            <Typography className="dashboard-control-number-1-title" type="small">{title}</Typography>
        </div>
    )
}

interface ReadOnlyControlElementProps{
    value: number
    onClick?: ()=>void
    title: string
    size?: 1 | 2 | 3 | 4
}

const ReadOnlyControlElement:React.FC<ReadOnlyControlElementProps> = ({value, onClick, title, size}) => {

    return(
        <div className={`dashboard-control-bool-1 ${value?"action":undefined}`} style={{width: size === 1?SIZE1_ITEM_WIDTH:SIZE2_ITEM_WIDTH, height: SIZE_ITEM_HEIGHT}} onClick={onClick}>
            <Typography className="dashboard-control-bool-1-val" type="title-2">{value}</Typography>
            <Typography className="dashboard-control-bool-1-title" type="small">{title}</Typography>
        </div>
    )
}

interface BoolControlDeviceProps{
    data: ControlElementNumber
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

const NumberControlDevice: React.FC<BoolControlDeviceProps> = ({ data }) => {
    const {fieldValue, updateFieldState, field} = useControlDevice(data.data)

    if(!field)
        return null

    if (data.readonly) {
        return (
            <ReadOnlyControlElement size={data.width} title={data.title} value={fieldValue ?? 0} />
        );
    }

    return (
        <NumberControlElement max={Number(field.high)} min={Number(field.low)} size={data.width} title={data.title} onChange={updateFieldState} value={fieldValue ?? 0}/>
    )
};

// const BoolControlRoom: React.FC<BoolControlDeviceProps> = ({ data }) => {
//     const room_name = data.data.split(".")[1] ?? ""
//     const typeDevice = data.data.split(".")[2] ?? ""
//     const field = data.data.split(".")[3] ?? ""
//     const {rooms} = useContext(HomePageContext)
//     const room = useMemo(()=>rooms.find(i=>i.name_room===room_name),[rooms])
//     const {click, value} = useBoolRoom(typeDevice, field, room ?? null)

//     if (data.readonly) {
//         return (
//             <BoolControlElement title={data.title} value={value ?? false}/>
//         );
//     }

//     return (
//         <BoolControlElement title={data.title} onClick={click} value={value ?? false}/>
//     )
// };


interface NumberControlProps{
    data: ControlElementNumber
}

export const NumberControl:React.FC<NumberControlProps> = ({data}) => {
    const type = data.data.split(".")[0] ?? ""

    if(type === "device")
        return <NumberControlDevice data={data}/>
    // if(type === 'room')
    //     return <BoolControlRoom data={data}/>

    return null
}

