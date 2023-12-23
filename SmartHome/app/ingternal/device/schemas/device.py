from enum import Enum
from pydantic import BaseModel
from typing import Optional, List, Dict
from app.ingternal.device.enums import ReceivedDataFormat, StatusDevice
from app.ingternal.device.schemas.field import AddDeviceFieldSchema, FieldDeviceSchema

class AddDeviceSchema(BaseModel):
	name: str
	system_name: str
	class_device: str
	type: str
	address: Optional[str]
	token: Optional[str]
	device_cyclic_polling: bool
	type_command: ReceivedDataFormat = ReceivedDataFormat.JSON
	device_polling: bool
	fields: List[AddDeviceFieldSchema]
	
	class Config:  
		use_enum_values = True

class EditDeviceSchema(AddDeviceSchema):
	pass
		
class DeviceSchema(BaseModel):
	name: str
	system_name: str
	class_device: str
	type: str 
	address: Optional[str]
	token: Optional[str]
	type_command: ReceivedDataFormat
	device_polling: bool
	device_cyclic_polling: bool
	device_status: Optional[StatusDevice] = StatusDevice.OFFLINE
	value: Optional[Dict[str,str]] = dict()
	fields: List[FieldDeviceSchema] = []

class ConsctionStatusForm(BaseModel):
	status: bool