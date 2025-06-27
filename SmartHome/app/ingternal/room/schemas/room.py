from typing import List, Optional
from pydantic import BaseModel

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

class RoomDevciesRawList(BaseModel):
    rooms: List[RoomDevicesRaw]

class RoomDevicesLink(BaseModel):
    name_room: str
    device: str

class RoomDevicesMove(BaseModel):
    name_room: str
    device: str
    poz: Optional[str] = None