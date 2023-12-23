from pydantic import BaseModel
from enum import Enum
from typing import Type, TypeVar, List, Optional, Any
from fastapi import APIRouter

class TypeAddDevice(str, Enum):
    MANUAL = "manual"
    AUTO = "auto"

class ValidTypeDevice(str, Enum):
    LIGHT = "light"
    SWITCHS = "switchs"
    WIRELESS_SWITCHS = "wireless switchs"
    RELAY = "relay"
    SOCKET = "socket"
    SENSOR = "sensor"
    VARIABLE = "variable"

class TypeDevice(str, Enum):
    LIGHT = "light"
    SWITCHS = "switchs"
    WIRELESS_SWITCHS = "wireless switchs"
    RELAY = "relay"
    SOCKET = "socket"
    SENSOR = "sensor"
    VARIABLE = "variable"
    ALL = "all"

class TypeValueDevice(str, Enum):
    TEXT = "text"
    JSON = "json"

# class AddDevice(BaseModel):
#     type: TypeAddDevice = TypeAddDevice.MANUAL
#     start: Optional[str] = None
#     ws_data: Optional[str] = None
#     stop: Optional[str] = None
#     address: Optional[str] = None
#     token: Optional[str] = None
#     information: Optional[str] = None
#     valueType: Optional[TypeValueDevice] = None
#     description: str = ""
#     fields: bool = True

class AddDevice(BaseModel):
    type: TypeAddDevice = TypeAddDevice.MANUAL
    address: Optional[str] = None
    token: Optional[str] = ""
    information: Optional[str] = None
    valueType: Optional[TypeValueDevice] = TypeValueDevice.JSON
    description: str = ""
    fields: bool = True

class EditField(BaseModel):
    address: bool = False
    name: bool = False
    type: bool = False
    low: bool = False
    high: bool = False
    values: bool = False
    control: bool = False
    icon: bool = False
    unit: bool = False
    add: bool = False
    delete: bool = False

class EditDevice(BaseModel):
    address: bool = False
    token: bool = False
    information: bool = False
    valueType: bool = False
    description: bool = False
    fields: EditField = EditField()
#
# class DeviceData(BaseModel):
#     name: str
#     deviceClass: Type[BaseDevice]
#     typeDevices: List[TypeDevice]

# class ModelAPIData(BaseModel):
#     name: str
#
#
# class ModelData(BaseModel):
#     name: str
#     dependencies: List[str]
#     status: bool = True
    # api: Optional[APIRouter] = None
    # api: Optional[APIRouter] = None
