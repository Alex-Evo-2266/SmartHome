from pydantic import BaseModel
from typing import Optional, List, Dict


class RoomSchema(BaseModel):
    name: str
    systemName: str
    devices: List[str]
    tempSensor: str
    
