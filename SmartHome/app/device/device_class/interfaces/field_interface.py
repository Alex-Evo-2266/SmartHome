from typing import Any, Dict, List
from app.device.device_class.interfaces.type_field import TypeField
from app.exceptions.exceptions import InvalidInputException
from app.device.schemas import FieldDeviceSchema

class IField(object):
	"""docstring for DeviceElement."""

	def get(self) -> Any:
		'''
		get value
		'''
		pass

	def get_high(self) -> str:
		return ""

	def get_low(self) -> str:
		return ""

	def get_type(self) -> TypeField:
		return TypeField.BASE

	def get_unit(self) -> str:
		return ""

	def get_name(self) -> str:
		return ""

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