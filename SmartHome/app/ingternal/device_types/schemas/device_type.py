from enum import Enum
from pydantic import BaseModel
from typing import Optional, List, Dict
from app.ingternal.device_types.types_names import TypesDeviceEnum
from app.ingternal.device.schemas.enums import TypeDeviceField

class FieldDeviceTypeSchema(BaseModel):
	name_field_type: str
	description: Optional[str] = ""    # Описание поля
	type_field: TypeDeviceField    # Ожидаемый тип поля
	required: bool = False  # Обязательное ли поле

	class Config:  
		use_enum_values = True

class DeviceTypeSchema(BaseModel):
	name: str
	field: Dict[str, FieldDeviceTypeSchema] 

	class Config:  
		use_enum_values = True

class DeviceTypeResponseSchema(BaseModel):
	data: List[DeviceTypeSchema]

class FieldDeviceTypeSerializeSchema(BaseModel):
	id: str
	name_field_type: str
	id_field_device: str
	description: str    # Описание поля
	field_type: TypeDeviceField    # Ожидаемый тип поля
	required: bool = False  # Обязательное ли поле
	device_type: Optional['DeviceTypeSerializeSchema'] = None

	class Config:  
		use_enum_values = True

class DeviceTypeSerializeSchema(BaseModel):
	id: str
	name_type: TypesDeviceEnum
	fields: Optional[List[FieldDeviceTypeSerializeSchema]] = None
	device: Optional[str] = None

	class Config:  
		use_enum_values = True

class DeviceTypeSerializeResponseSchema(BaseModel):
	data: List[DeviceTypeSerializeSchema]