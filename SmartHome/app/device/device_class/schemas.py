from typing import List, Optional, Dict
from pydantic import BaseModel
from app.device.enums import Type_device_field, Received_Data_Format, Status_Device

class ChangeField(BaseModel):
	added:bool = True
	deleted:bool = True
	name:bool = True
	address:bool = True
	control:bool = True
	high:bool = True
	low:bool = True
	icon:bool = True
	type:bool = True
	unit:bool = True
	enum_values:bool = True
	value:bool = False

class ChangeDevice(BaseModel):
	fields:ChangeField = ChangeField()
	address:bool = True
	token:bool = False

class ConfigSchema(BaseModel):
	address: bool = True
	token: bool = False
	fields_addition: bool = True
	fields_change: ChangeField = ChangeField()
	added_url: Optional[str] = None
	change_url: Optional[str] = None
	
class AdditionDevice(BaseModel):
	fields:bool = True
	address:bool = True
	token:bool = False


