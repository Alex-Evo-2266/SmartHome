from enum import Enum
from pydantic import BaseModel
from typing import Optional, List, Dict
from app.device.enums import ReceivedDataFormat, StatusDevice, TypeDeviceField
from app.device.models import Device_field

class AddDeviceFieldSchema(BaseModel):
	name: str
	address: Optional[str]
	type: TypeDeviceField
	low: Optional[str]
	high: Optional[str]
	enum_values: Optional[str]
	read_only: bool
	icon: str = "fas fa-circle-notch"
	unit: Optional[str]
	virtual_field: bool

	class Config:  
		use_enum_values = True

class AddDeviceSchema(BaseModel):
	name: str
	system_name: str
	class_device: str
	type: str
	address: Optional[str]
	token: Optional[str]
	type_command: ReceivedDataFormat = ReceivedDataFormat.JSON
	fields: List[AddDeviceFieldSchema]
	
	class Config:  
		use_enum_values = True

class EditDeviceSchema(AddDeviceSchema):
	pass
		
class FieldDeviceSchema(BaseModel):
	name: str
	address: Optional[str]
	type: TypeDeviceField
	low: Optional[str]
	high: Optional[str]
	enum_values: Optional[str]
	read_only: bool
	icon: str
	unit: Optional[str] 
	virtual_field: bool
	value: Optional[str]

class DeviceSchema(BaseModel):
	name: str
	system_name: str
	class_device: str
	type: str 
	address: Optional[str]
	token: Optional[str]
	type_command: ReceivedDataFormat
	device_polling: bool
	device_status: Optional[StatusDevice] = StatusDevice.OFFLINE
	value: Optional[Dict[str,str]] = dict()
	fields: List[FieldDeviceSchema] = []