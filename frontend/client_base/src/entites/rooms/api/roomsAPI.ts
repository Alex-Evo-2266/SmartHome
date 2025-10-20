import { useCallback, useEffect, useState } from "react"
import { useHttp } from "../../../shared/lib/hooks/http.hook"
import { useSnackbar } from "../../../shared/lib/hooks/snackbar.hook"
import { Room, RoomCreate, Rooms } from ".."
import { TypeRequest } from "../../../shared/api/type"

export const useRoomAPI = () => {

    const {request, loading, error, clearError} = useHttp()
    const {showSnackbar} = useSnackbar()
    

    const getRooms = useCallback(async()=>{
        const data: Rooms = await request("/api-devices/rooms", TypeRequest.GET)
        return data
    },[request])

    const getRoom = useCallback(async(roomName:string)=>{
        const data: Room = await request(`/api-devices/rooms/${roomName}`, TypeRequest.GET)
        return data
    },[request])

    const addRoom = useCallback(async (data: RoomCreate)=>{
        await request("/api-devices/rooms", TypeRequest.POST, {...data})
    },[request])

    const deleteRoom = useCallback(async (roomName: string)=>{
        await request(`/api-devices/rooms/${roomName}`, TypeRequest.DELETE)
    },[request])

    const roomSetDevice = useCallback(async (roomName: string, deviceNameList: string[])=>{
        await request(`/api-devices/rooms/${roomName}/devices`, TypeRequest.PATCH, {devices: deviceNameList})
    },[request])

    const roomSetDeviceValue = useCallback(async (roomName: string, device_type: string, field_name: string, value: string)=>{
        await request(`/api-devices/rooms/set/value`, TypeRequest.PATCH, {name_room: roomName, device_type: device_type, field_name: field_name, value: value})
    },[request])

    useEffect(()=>{
        if (error)
            showSnackbar(error, {}, 10000)
        return ()=>{
            clearError();
        }
    },[error, clearError, showSnackbar])

    return {
        getRooms,
        getRoom,
        addRoom,
        deleteRoom,
        roomSetDevice,
        roomSetDeviceValue,
        loading
    }
}

export const useRooms = () => {

    const {getRooms, loading} = useRoomAPI()
    const [rooms, setRooms] = useState<Room[]>([])

    const loadRoom = useCallback(async()=>{
        const data = await getRooms()
        setRooms(data.rooms)
    },[getRooms])

    useEffect(()=>{
        loadRoom()
    },[loadRoom])

    return {
        getRooms,
        loading,
        rooms,
        loadRoom
    }
}