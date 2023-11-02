from typing import Any, Dict, List
from app.device.enums import TypeDeviceField
from app.exceptions.exceptions import InvalidInputException
from app.device.schemas import FieldDeviceSchema, AddDeviceFieldSchema

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

	def get_type(self) -> TypeDeviceField:
		return TypeDeviceField.BASE

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

	def _get_initial_data(self)->AddDeviceFieldSchema:
		pass