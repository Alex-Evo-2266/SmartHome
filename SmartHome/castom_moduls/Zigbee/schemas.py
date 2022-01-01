from pydantic import BaseModel
from typing import Optional, List, Any, Dict

class PermitJoin(BaseModel):
    state: bool

class ZigbeeDeviceSchema(BaseModel):
    name: str
    root_address: str
    address: str
    allAddress: str
    type: Optional[str]
    power_source: Optional[str]
    model: Optional[str]
    description: Optional[str]
    vendor: Optional[str]
    exposes: Optional[List[Any]]
