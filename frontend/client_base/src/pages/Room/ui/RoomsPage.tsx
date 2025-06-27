import { FAB, GridLayout, GridLayoutItem, Plus, TextDialog } from "alex-evo-sh-ui-kit"
import { useRoom } from "../hooks/rooms.hook"
import { RoomCard } from "./RoomCard"
import { DialogPortal } from "../../../shared"
import { useCallback, useState } from "react"
import './RoomPage.scss'

export const RoomsPage = () => {

    const {rooms, addRoom, getRooms} = useRoom()
    const [visible, setVisible] = useState<boolean>(false)

    const addRoomHandler = useCallback(async(data:string)=>{
        await addRoom({name_room: data})
        await getRooms()
        setVisible(false)
    },[addRoom])

    return(
        <div className="rooms-page container-page">
            <GridLayout itemWith="300px">
            {
                rooms.map((item)=>(
                    <GridLayoutItem>
                        <RoomCard key={item.name_room} name={item.name_room}></RoomCard>
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