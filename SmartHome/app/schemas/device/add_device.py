from enum import Enum
from pydantic import BaseModel
from typing import Optional, List, Dict
from app.schemas.device.enums import ReceivedDataFormat, TypeDeviceField, DeviceGetData, DeviceFieldCategory, FieldGetDataType

class AddDeviceFieldSchema(BaseModel):
	name: str
	address: Optional[str] = "virtual"
	type: TypeDeviceField
	low: Optional[str] = None
	high: Optional[str] = None
	enum_values: Optional[str] = None
	read_only: bool
	entity: Optional[str] = None
	icon: str = "room"
	unit: Optional[str] = None
	virtual_field: bool
	tag:Optional[str] = None
	category: Optional[DeviceFieldCategory] = None
	type_get_value: Optional[FieldGetDataType] = FieldGetDataType.PUBLISH

	class Config:  
		use_enum_values = True

class AddDeviceSchema(BaseModel):
	name: str
	system_name: str
	class_device: str
	type: Optional[str] = None
	address: Optional[str] = "virtual"
	token: Optional[str] = None
	type_command: ReceivedDataFormat = ReceivedDataFormat.JSON
	type_get_data: DeviceGetData = DeviceGetData.PUSH
	fields: List[AddDeviceFieldSchema]
	room: Optional[str] = None
	
	class Config:  
		use_enum_values = True