import { useCallback, useEffect, useState } from "react"

import { Room } from "../../../entites/rooms"
import { useRoomAPI } from "../../../entites/rooms/api/roomsAPI"

export const useRoom = () => {

    const {loading, getRooms, ...props} = useRoomAPI()
    const [rooms, setRooms] = useState<Room[]>([])

    const _getRooms = useCallback(async()=>{
        const rooms = await getRooms()
        setRooms(rooms.rooms)
    },[setRooms, getRooms])

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