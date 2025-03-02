from enum import Enum
from pydantic import BaseModel
from typing import Optional, List, Dict
from .enums import ReceivedDataFormat, TypeDeviceField, StatusDevice, DeviceGetData, DeviceStatusField

class DeviceInitFieldSchema(BaseModel):
	name: str
	address: Optional[str] = None
	type: TypeDeviceField
	low: Optional[str] = None
	high: Optional[str] = None
	enum_values: Optional[str] = None
	read_only: bool
	icon: str
	unit: Optional[str] = None
	entity: Optional[str] = None
	entity_list_id: Optional[List[str]] = None
	virtual_field: bool
	device: Optional['DeviceSerializeSchema'] = None
	value: Optional[str] = None

	class Config:  
		use_enum_values = True

class DeviceSerializeFieldSchema(DeviceInitFieldSchema):
	id: str

	class Config:  
		use_enum_values = True

class StatusForm(BaseModel):
	status: bool

class DeviceSerializeSchema(BaseModel):
	name: str
	system_name: str
	class_device: str
	type: str
	address: Optional[str] = None
	token: Optional[str] = None
	type_command: ReceivedDataFormat
	type_get_data: DeviceGetData
	status: StatusDevice = StatusDevice.UNKNOWN
	fields: Optional[List[DeviceSerializeFieldSchema]] = None

	class Config:  
		use_enum_values = True

class DeviceSchema(DeviceSerializeSchema):
	value: Optional[Dict[str,str]] = dict()

class ValueSerializeSchema(BaseModel):
	id: str
	datatime: str
	value: str
	field: Optional[DeviceSerializeFieldSchema]

	class Config:  
		use_enum_values = True

