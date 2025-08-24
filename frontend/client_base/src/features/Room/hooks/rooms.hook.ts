import { useCallback, useEffect, useState } from "react"
import { useRoomAPI } from "../../../entites/rooms/api/roomsAPI"
import { Room } from "../../../entites/rooms"

export const useRoom = () => {

    const {loading, getRooms, ...props} = useRoomAPI()
    const [rooms, setRooms] = useState<Room[]>([])

    const _getRooms = useCallback(async()=>{
        const rooms = await getRooms()
        setRooms(rooms.rooms)
    },[])

    useEffect(()=>{
        _getRooms()
    },[_getRooms])

    return{
        ...props,
        loading,
        getRooms: _getRooms,
        rooms
    }
}