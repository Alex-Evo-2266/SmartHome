import { useCallback, useEffect, useState } from "react"
import { SelectField } from "../../../shared"
import { IOption } from "alex-evo-sh-ui-kit"
import { useRoomAPI } from "../../../entites/rooms"

export interface ISelectRoom {
    value: string,
    onChange: (data: string)=>void
}

export const SelectRoom:React.FC<ISelectRoom> = ({value, onChange}) => {

    const {getRooms} = useRoomAPI()
    const [items, setItems] = useState<IOption[]>([{value:"", title:""}])

    const loadRooms = useCallback(async()=>{
        const data = await getRooms()
        const newData = data.rooms.map(item=>({title:item.name_room, value: item.name_room}))
        newData.push({title: "", value: ""})
        setItems(newData)
    },[getRooms])

    useEffect(()=>{
        loadRooms()
    },[loadRooms])

    return(
        <SelectField placeholder="room" border items={items} onChange={onChange} value={value}/>
    )
}