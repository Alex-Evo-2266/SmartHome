from enum import Enum
from pydantic import BaseModel
from typing import Optional, List, Dict
from app.ingternal.device.schemas.enums import ReceivedDataFormat, TypeDeviceField, DeviceGetData

class AddDeviceFieldSchema(BaseModel):
	name: str
	address: Optional[str]
	type: TypeDeviceField
	low: Optional[str] = None
	high: Optional[str] = None
	enum_values: Optional[str] = None
	read_only: bool
	entity: Optional[str] = None
	icon: str = "room"
	unit: Optional[str] = None
	virtual_field: bool

	class Config:  
		use_enum_values = True

class AddDeviceSchema(BaseModel):
	name: str
	system_name: str
	class_device: str
	type: str
	address: Optional[str]
	token: Optional[str] = None
	type_command: ReceivedDataFormat = ReceivedDataFormat.JSON
	type_get_data: DeviceGetData = DeviceGetData.PUSH
	fields: List[AddDeviceFieldSchema]
	
	class Config:  
		use_enum_values = True