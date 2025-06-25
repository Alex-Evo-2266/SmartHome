from typing import List
from pydantic import BaseModel

class RoomCreate(BaseModel):
    name_room: str

class RoomDevciesUpdate(BaseModel):
    devices: List[str]



class RoomUpdate(BaseModel):
    name_room: str

class RoomDevciesRaw(BaseModel):
    name_room: str
    devices: List[str]

class RoomDevciesRawList(BaseModel):
    rooms: List[RoomDevciesRaw]

class RoomDevciesMove(BaseModel):
    name_room: str
    device: str
    poz: str