from pydantic import BaseModel
from typing import Optional, List, Dict

class GroupFieldSchema(BaseModel):
    name: str
    type: str

class GroupDeviceSchema(BaseModel):
    name: str
    fields: List[GroupFieldSchema] = []

class GroupSchema(BaseModel):
    name: str
    systemName: str
    devices: List[GroupDeviceSchema] = []
