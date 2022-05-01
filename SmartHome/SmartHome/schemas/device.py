from pydantic import BaseModel
from typing import Any, Optional, List, Dict
from moduls_src.models_schema import AddDevice, EditDevice, ValidTypeDevice

class TypesDeviceSchema(BaseModel):
    title: str
    typs: List[ValidTypeDevice]
    addConfig: AddDevice
    autoAddedConfig: Optional[Any] = None
    editConfig: EditDevice

class DeviceFieldSchema(BaseModel):
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
    fields: List[DeviceFieldSchema]
    token: Optional[str]
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
