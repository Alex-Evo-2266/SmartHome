from typing import Optional, List, Dict, Type
from app.ingternal.device_types.schemas.device_type import FieldDeviceTypeSchema
from app.ingternal.device_types.types_names import TypesDeviceEnum

class DeviceType:
	def __init__(self, 
				name: TypesDeviceEnum, 
				fields: List[FieldDeviceTypeSchema],
				label: str = "",
				description: str = ""
				):
		"""
		Класс типа устройства (абстрактный шаблон)
		
		:param name: Название типа устройства
		:param fields: Список определений полей типа
		"""
		self.name = name
		self.fields = {f.name_field_type: f for f in fields}
		self.label = label
		self.description = description
		
	def __repr__(self) -> str:
		return f"DeviceType(name='{self.name}')"
		
