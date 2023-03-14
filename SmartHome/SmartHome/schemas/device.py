from pydantic import BaseModel
from typing import Any, Optional, List, Dict
from moduls_src.models_schema import AddDevice, EditDevice, ValidTypeDevice

class TypesDeviceSchema(BaseModel):
    title: str
    typs: List[ValidTypeDevice]
    addConfig: AddDevice
    autoAddedConfig: Optional[Any] = None
    editConfig: EditDevice

class DeviceStatusSchema(BaseModel):
    systemName: str
    status: bool

class DeviceValueSchema(BaseModel):
    systemName: str
    type: str
    status: str
