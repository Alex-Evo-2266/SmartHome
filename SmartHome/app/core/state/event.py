from typing import Dict, List, Optional, Any
from pydantic import BaseModel, Field
from app.schemas.device.device import DeviceSerializeSchema
import time

class DevicePatch(BaseModel):
    system_name: str
    changes: Dict[str, Optional[str]]
    version: int
    updated_at: float

class DeviceSnapshot(BaseModel):
    description: DeviceSerializeSchema
    system_name: str
    state: Dict[str, Optional[str]]
    version: int
    updated_at: float


class RoomDevicePatch(BaseModel):
    room: str
    type_name: str
    changes: Dict[str, Any]
    version: int
    updated_at: float


class RoomDeviceSnapshot(BaseModel):
    type_name: str
    state: Dict[str, Any]
    version: int
    updated_at: float

class RoomSnapshot(BaseModel):
    room: str
    devices: List[RoomDeviceSnapshot]

class DeviceEvent(BaseModel):
    system_name: str
    source: str              # mqtt / matter / poll / http
    changes: Dict[str, Optional[str]]
    timestamp: float = Field(default_factory=time.time)