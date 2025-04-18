from enum import Enum
from pydantic import BaseModel
from typing import Optional, List, Dict
from app.ingternal.device.schemas.enums import ReceivedDataFormat, TypeDeviceField, StatusDevice, DeviceGetData, DeviceStatusField
from app.ingternal.device_types.schemas.device_type import DeviceTypeSerializeSchema

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
	type: Optional[str] = None
	address: Optional[str] = None
	token: Optional[str] = None
	type_command: ReceivedDataFormat
	type_get_data: DeviceGetData
	status: StatusDevice = StatusDevice.UNKNOWN
	fields: Optional[List[DeviceSerializeFieldSchema]] = None
	type_mask: Optional[DeviceTypeSerializeSchema] = None

	class Config:  
		use_enum_values = True

class DeviceSchema(DeviceSerializeSchema):
	value: Optional[Dict[str,str]] = dict()

class DeviceResponseSchema(BaseModel):
	data: List[DeviceSchema]

class ValueSerializeSchema(BaseModel):
	id: str
	datatime: str
	value: str
	field: Optional[DeviceSerializeFieldSchema] = None

	class Config:  
		use_enum_values = True

class ValueSerializeStorysSchema(BaseModel):
	id: str
	datatime: str
	value: str

	class Config:  
		use_enum_values = True

class ValueSerializeResponseSchema(BaseModel):
	data: List[ValueSerializeStorysSchema]
	field_id: str
	type: TypeDeviceField
	high: Optional[str] = None
	low: Optional[str] = None
	name: str

	class Config:  
		use_enum_values = True

class ValueSerializeResponseListSchema(BaseModel):
	data: List[ValueSerializeResponseSchema]
	system_name: str