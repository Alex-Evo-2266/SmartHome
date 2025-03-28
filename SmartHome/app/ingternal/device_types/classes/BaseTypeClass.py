from enum import Enum
from pydantic import BaseModel
from typing import Optional, List, Dict, Type
from app.ingternal.device.schemas.enums import TypeDeviceField

class FieldDefinition(BaseModel):
	"""Описание поля типа устройства"""
	name: str           # Имя поля в типе
	description: str    # Описание поля
	field_type: TypeDeviceField    # Ожидаемый тип поля
	required: bool = True  # Обязательное ли поле

	class Config:  
		use_enum_values = True

class DeviceType:
	def __init__(self, 
				type_id: str,
				name: str, 
				fields: List[FieldDefinition]):
		"""
		Класс типа устройства (абстрактный шаблон)
		
		:param type_id: Уникальный идентификатор типа
		:param name: Название типа устройства
		:param fields: Список определений полей типа
		"""
		self.type_id = type_id
		self.name = name
		self.fields = {f.name: f for f in fields}
		
	def __repr__(self) -> str:
		return f"DeviceType(type_id='{self.type_id}', name='{self.name}')"
		
