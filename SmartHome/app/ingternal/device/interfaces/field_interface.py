from typing import Any, Dict, List
from app.ingternal.device.enums import TypeDeviceField
from app.ingternal.device.schemas.field import FieldDeviceSchema, AddDeviceFieldSchema

class IField(object):
	"""docstring for DeviceElement."""

	def get(self) -> Any:
		'''
		get value
		'''
		pass

	def get_high(self) -> str:
		return ""
	
	def get_entity(self) -> str:
		return ""

	def get_low(self) -> str:
		return ""
	
	def is_read_only(self) -> bool:
		pass

	def get_type(self) -> TypeDeviceField:
		return TypeDeviceField.BASE

	def get_unit(self) -> str:
		return ""

	def get_name(self) -> str:
		return ""
	
	def get_address(self) -> str:
		return ""
	
	def is_virtual_field(self) -> bool:
		pass

	def set(self, status: Any, script=True):
		'''
		set value.
		the "script" argument determines whether the associated scripts will be activated.
		'''
		pass

	def get_data(self)->FieldDeviceSchema | None:
		'''
		information about the field in the form of a dictionary.
		'''
		pass


	def dict(self)->Dict[str, Any] | None:
		'''
		information about the field in the form of a dictionary.
		'''
		pass

	def _get_initial_data(self)->AddDeviceFieldSchema:
		pass