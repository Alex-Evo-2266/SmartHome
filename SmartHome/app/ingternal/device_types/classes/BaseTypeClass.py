from typing import Optional, List, Dict, Type
from app.ingternal.device_types.schemas.device_type import FieldDeviceTypeSchema

class DeviceType:
	def __init__(self, 
				name: str, 
				fields: List[FieldDeviceTypeSchema],
				label: str = "",
				description: str = ""
				):
		"""
		Класс типа устройства (абстрактный шаблон)
		
		:param type_id: Уникальный идентификатор типа
		:param name: Название типа устройства
		:param fields: Список определений полей типа
		"""
		self.name = name
		self.fields = {f.name_field_type: f for f in fields}
		self.label = label
		self.description = description
		
	def __repr__(self) -> str:
		return f"DeviceType(name='{self.name}')"
		
