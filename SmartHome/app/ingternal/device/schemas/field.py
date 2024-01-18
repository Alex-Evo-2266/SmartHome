from pydantic import BaseModel
from typing import Optional
from app.ingternal.device.enums import TypeDeviceField

class AddDeviceFieldSchema(BaseModel):
	name: str
	address: Optional[str]
	type: TypeDeviceField
	low: Optional[str]
	high: Optional[str]
	enum_values: Optional[str]
	read_only: bool
	entity: Optional[str]
	icon: str = "room"
	unit: Optional[str]
	virtual_field: bool

	class Config:  
		use_enum_values = True

class FieldDeviceSchema(BaseModel):
	name: str
	address: Optional[str]
	type: TypeDeviceField
	low: Optional[str]
	high: Optional[str]
	enum_values: Optional[str]
	read_only: bool
	entity: Optional[str]
	icon: str
	unit: Optional[str] 
	virtual_field: bool
	value: Optional[str]