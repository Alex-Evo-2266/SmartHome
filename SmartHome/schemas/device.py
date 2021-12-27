from pydantic import BaseModel
from typing import Optional, List

class TypesDeviceSchema(BaseModel):
    title: str
    interface: List[str]
