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

class AddDevice(BaseModel):
    type: TypeAddDevice = TypeAddDevice.MANUAL
    start: Optional[str] = None
    ws_data: Optional[str] = None
    stop: Optional[str] = None
    address: Optional[str] = None
    token: Optional[str] = None
    information: Optional[str] = None
    valueType: Optional[TypeValueDevice] = None
    description: str = ""
    fields: bool = True

#
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
