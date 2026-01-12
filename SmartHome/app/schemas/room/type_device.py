from typing import List, Dict
from pydantic import BaseModel
from app.schemas.device.enums import TypeDeviceField

class DeviceField(BaseModel):
    system_name: str
    id_field_device: str


class DeviceFieldType(BaseModel):
    field_type: TypeDeviceField
    readonly: bool = False
    devices: List[DeviceField] = []


class DeviceTypeModel(BaseModel):
    # ключ — это name_field_type
    fields: Dict[str, DeviceFieldType] = {}


class DeviceRoom(BaseModel):
    system_name: str
    poz: int


class RoomDevicesRaw(BaseModel):
    name_room: str
    devices: List[DeviceRoom]
    # ключ — это name_type
    device_room: Dict[str, DeviceTypeModel]
