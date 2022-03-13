from pydantic import BaseModel
from typing import Optional, List, Dict

class GroupFieldSchema(BaseModel):
    name: str
    type: str

class GroupDeviceSchema(BaseModel):
    name: str
    fields: List[GroupFieldSchema] = []

class GroupFieldConfigSchema(BaseModel):
    name: str
    type: str
    low: str
    high: str
    values: Optional[str]
    control: bool
    icon: str = "fas fa-circle-notch"
    unit: Optional[str]

class GroupSchema(BaseModel):
    name: str
    systemName: str
    devices: List[GroupDeviceSchema] = []
    fields: List[GroupFieldConfigSchema] = []
