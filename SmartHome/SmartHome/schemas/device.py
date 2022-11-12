from pydantic import BaseModel
from typing import Optional, List, Dict
from moduls_src.models_schema import AddDevice, ValidTypeDevice

class TypesDeviceSchema(BaseModel):
    title: str
    typs: List[ValidTypeDevice]
    config: AddDevice

class DeviceStatusSchema(BaseModel):
    systemName: str
    status: bool

class DeviceValueSchema(BaseModel):
    systemName: str
    type: str
    status: str
