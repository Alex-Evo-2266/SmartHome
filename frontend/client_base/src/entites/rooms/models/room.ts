
export interface RoomDevice {
    system_name: string
    poz?: string
}

export interface DeviceField {
  system_name: string;
  id_field_device: string;
}

export interface DeviceFieldType {
  field_type: string;
  devices: DeviceField[];
}

export interface DeviceTypeModel {
  // ключ — это name_field_type
  fields: Record<string, DeviceFieldType>;
}

export interface Room {
    name_room: string,
    devices: RoomDevice[]
    device_room: Record<string, DeviceTypeModel>
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