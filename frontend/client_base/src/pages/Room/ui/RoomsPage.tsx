import { FAB, GridLayout, GridLayoutItem, Plus, TextDialog } from "alex-evo-sh-ui-kit"
import { useCallback, useState } from "react"

import { RoomCard } from "./RoomCard"
import { useRoom } from "../../../features/Room/hooks/rooms.hook"
import { DialogPortal } from "../../../shared"
import { Loading } from "../../../shared/ui/Loading"

import './RoomPage.scss'

export const RoomsPage = () => {

    const {rooms, addRoom, getRooms, loading} = useRoom()
    const [visible, setVisible] = useState<boolean>(false)

    const addRoomHandler = useCallback(async(data:string)=>{
        await addRoom({name_room: data})
        await getRooms()
        setVisible(false)
    },[addRoom, getRooms])

    if(loading)
    {
        return <Loading/>
    }

    return(
        <div className="rooms-page container-page">
            <GridLayout itemWith="300px">
            {
                rooms.map((item)=>(
                    <GridLayoutItem key={item.name_room}>
                        <RoomCard room={item}></RoomCard>
                    </GridLayoutItem>
                ))
            }
            </GridLayout>
            <FAB icon={<Plus/>} onClick={()=>setVisible(true)}/>
            {
                visible &&
                <DialogPortal>
                    <TextDialog header="Add room" text="Entered name room" onSuccess={addRoomHandler} onHide={()=>setVisible(false)}/>
                </DialogPortal>
            }
        </div>
    )
}