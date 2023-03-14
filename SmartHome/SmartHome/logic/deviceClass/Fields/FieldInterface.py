from typing import Any, Dict, List
from SmartHome.logic.deviceClass.Fields.TypeField import TypeField
from exceptions.exceptions import InvalidInputException
from SmartHome.logic.deviceFile.schema import DeviceFieldSchema

def getParams(d:Dict[str, Any], param:str, default:Any|None=None)->Any:
	if(param in d):
		return d[param]
	elif(not default):
		raise InvalidInputException("invalid fields data")
	else:
		return default

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

	def get_data(self)->DeviceFieldSchema | None:
		'''
		information about the field in the form of a dictionary.
		'''
		pass
