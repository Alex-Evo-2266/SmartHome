from enum import Enum
from pydantic import BaseModel
from typing import Optional, List, Dict
from app.ingternal.device_types.types_names import TypesDeviceEnum
from app.ingternal.device.schemas.enums import TypeDeviceField


class AddFieldDeviceTypeSerializeSchema(BaseModel):
	name_field_type: str
	id_field_device: str
	description: str    # Описание поля
	field_type: TypeDeviceField    # Ожидаемый тип поля
	required: bool = True  # Обязательное ли поле

	class Config:  
		use_enum_values = True

		
class AddOrEditDeviceTypeSchema(BaseModel):
	device: str
	name_type: TypesDeviceEnum
	fields: Optional[List[AddFieldDeviceTypeSerializeSchema]] = None
	
	class Config:  
		use_enum_values = True