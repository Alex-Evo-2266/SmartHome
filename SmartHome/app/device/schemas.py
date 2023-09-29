from enum import Enum
from pydantic import BaseModel
from typing import Optional, List, Dict
from app.device.enums import Received_Data_Format, Status_Device, Type_device_field
from app.device.models import Device_field

class AddDeviceFieldSchema(BaseModel):
	name: str
	address: Optional[str]
	type: Type_device_field
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
	type_command: Received_Data_Format = Received_Data_Format.JSON
	fields: List[AddDeviceFieldSchema]
	
	class Config:  
		use_enum_values = True
		
