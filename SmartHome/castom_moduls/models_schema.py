from pydantic import BaseModel
from enum import Enum
from typing import Type, List, Optional
from fastapi import APIRouter

from SmartHome.logic.device.BaseDeviceClass import BaseDevice

class TypeDevice(str, Enum):
    LIGHT = "light"
    SWITCHS = "switchs"
    WIRELESS_SWITCHS = "wireless switchs"
    RELAY = "relay"
    SOCKET = "socket"
    SENSOR = "sensor"
    VARIABLE = "variable"


class DeviceData(BaseModel):
    name: str
    deviceClass: Type[BaseDevice]
    typeDevices: List[TypeDevice]

class ModelAPIData(BaseModel):
    name: str


class ModelData(BaseModel):
    name: str
    dependencies: List[str]
    deviceType: Optional[List[DeviceData]] = None
    # api: Optional[APIRouter] = None
    # api: Optional[APIRouter] = None
