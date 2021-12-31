from pydantic import BaseModel
from typing import Optional, List, Dict

class TypesDeviceSchema(BaseModel):
    title: str
    interface: List[str]

class DeviceFieldConfigSchema(BaseModel):
    address: Optional[str]
    name: str
    value: Optional[str]
    type: str
    low: str
    high: str
    values: Optional[str]
    control: bool
    icon: str = "fas fa-circle-notch"
    unit: Optional[str]

class DeviceSchema(BaseModel):
    typeConnect: str
    type: str
    valueType: str = 'json'
    name: str
    status :Optional[str] = 'online'
    information: Optional[str] = ''
    address: str
    systemName: str
    config: List[DeviceFieldConfigSchema]
    token: Optional[str]
    RoomId: Optional[int] = None
    value: Optional[Dict[str,str]]

class DeviceEditSchema(DeviceSchema):
    newSystemName: str

class DeviceStatusSchema(BaseModel):
    systemName: str
    status: bool

class DeviceValueSchema(BaseModel):
    systemName: str
    type: str
    status: str
