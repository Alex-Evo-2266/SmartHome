from typing import List, Optional, Dict, Any
from pydantic import BaseModel
from app.ingternal.device_types.types_names import TypesDeviceEnum

class ChangeField(BaseModel):
	creation:bool = True
	deleted:bool = True
	edit:bool = True
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
	virtual_field:bool = True
	read_only:bool = True

class ConfigSchema(BaseModel):
	address: bool = True
	token: bool = False
	type_get_data: bool = True
	fields_creation: bool = True
	fields_change: ChangeField = ChangeField()
	creation_url: Optional[str] = None
	change_url: Optional[str] = None
	class_img: Optional[str] = None
	init_field: bool = False
	virtual: bool = False
	type:bool = True
	available_types: Optional[List[TypesDeviceEnum]] = None

class DeviceClassConfigSchema(ConfigSchema):
	class_name: str
