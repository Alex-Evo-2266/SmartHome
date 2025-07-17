from enum import Enum
from pydantic import BaseModel
from typing import Optional, List, Dict
import datetime
from app.internal.script.schemas.enum import ScriptNodeType

class RoomDeviceData(BaseModel):
	device_name: str
	field_name: str
	field_id: str
		
class RoomData(BaseModel):
	room_name: str
	devices: Dict[str, Dict[str, List[RoomDeviceData]]]