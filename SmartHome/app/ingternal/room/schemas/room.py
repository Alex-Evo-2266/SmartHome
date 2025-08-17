from typing import List, Optional, Dict, Tuple
from pydantic import BaseModel
from app.ingternal.room.schemas.type_device import DeviceTypeModel

class RoomCreate(BaseModel):
    name_room: str

class DeviceRoom(BaseModel):
    system_name: str
    poz: Optional[str] = None

class RoomDevicesUpdate(BaseModel):
    devices: List[DeviceRoom]

class RoomUpdate(BaseModel):
    name_room: str

class RoomDevicesRaw(BaseModel):
    name_room: str
    devices: List[DeviceRoom]
    device_room: Optional[Dict[str, DeviceTypeModel]] = None

class RoomDevciesRawList(BaseModel):
    rooms: List[RoomDevicesRaw]

class RoomDevicesLink(BaseModel):
    name_room: str
    device: str

class RoomDevicesMove(BaseModel):
    name_room: str
    device: str
    poz: Optional[str] = None

class RoomDevicesSet(BaseModel):
    device_type: str
    field_name: str
    value: str
    name_room: str
