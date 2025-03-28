from enum import Enum
from pydantic import BaseModel
from typing import Optional, List, Dict
from app.ingternal.device_types.schemas.enum import TypesDeviceEnum
from app.ingternal.device.schemas.enums import TypeDeviceField


class FieldDeviceTypeSerializeSchema(BaseModel):
	id: str
	name_field_type: str
	id_field_device: str
	description: str    # Описание поля
	field_type: TypeDeviceField    # Ожидаемый тип поля
	required: bool = True  # Обязательное ли поле
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