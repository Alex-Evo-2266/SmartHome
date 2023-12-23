from pydantic import BaseModel
from app.ingternal.device.enums import TypeDeviceField
from typing import List

class FieldTypeDevice(BaseModel):
	name: str
	type: TypeDeviceField
	
class TypeDevice(BaseModel):
	name: str
	fields: List[FieldTypeDevice] = []