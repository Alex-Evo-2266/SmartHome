from enum import Enum
from pydantic import BaseModel
from typing import Optional, List, Dict

class Received_Data_Format(str, Enum):
    JSON = "json"
    STRING = "value"

class Status_Device(str, Enum):
    ONLINE = "online"
    OFFLINE = "offline"
    NOT_SUPPORTED = "not_supported"
    UNLINC = "unlinc"

class DeviceFieldSchema(BaseModel):
    address: Optional[str]
    name: str
    value: Optional[str]
    type: str
    low: Optional[str]
    high: Optional[str]
    enum_values: Optional[str]
    control: bool
    icon: str = "fas fa-circle-notch"
    unit: Optional[str]

class AddDeviceSchema(BaseModel):
    class_device: str
    type: str
    value_type: Received_Data_Format = Received_Data_Format.JSON
    name: str
    address: Optional[str]
    system_name: str
    fields: List[DeviceFieldSchema]
    token: Optional[str]

class EditDeviceSchema(AddDeviceSchema):
    pass

class DeviceSchema(BaseModel):
    class_device: str
    type: str
    type_field: Dict[str,str] = {}
    value_type: str = Received_Data_Format.JSON
    name: str
    status: Optional[Status_Device] = None
    information: Optional[str] = ''
    address: Optional[str]
    system_name: str
    fields: List[DeviceFieldSchema]
    token: Optional[str]
    value: Optional[Dict[str,str]] = {}

class DeviceEditSchema(DeviceSchema):
    newSystemName: str