
export interface RoomDevice {
    system_name: string
    poz?: string
}

export interface Room {
    name_room: string,
    devices: RoomDevice[]
}

export interface Rooms {
    rooms: Room[]
}

export interface RoomCreate {
    name_room: string
}

export interface RoomDevices {
    devices: RoomDevice[]
}