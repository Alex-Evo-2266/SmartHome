# from SmartHome.logic.script.run_script import run_by_trigger_scripts

from enum import Enum
from numbers import Number
from typing import Any, Dict, List
from app.device.enums import TypeDeviceField
from app.exceptions.exceptions import InvalidInputException
from app.device.device_class.field_interface import IField
from app.device.schemas import FieldDeviceSchema

def getParams(d:Dict[str, Any], param:str, default:Any|None=None)->Any:
	if(param in d):
		return d[param]
	elif(not default):
		raise InvalidInputException("invalid fields data")
	else:
		return default

class BaseField(IField):
	"""docstring for DeviceElement."""
	
	def __init__(
		self, 
		name:str, 
		device_system_name:str, 
		address:str|None = None, 
		read_only:bool = False, 
		high:str|None = None, 
		low:str|None = None,
		icon:str = "fas fa-circle-notch",
		type:TypeDeviceField = TypeDeviceField.BASE,
		unit:str = "",
		enum_values:List[str] = [],
		value:Any = None,
		virtual_field: bool = True
		# change:ChangeField = ChangeField()
		):
		'''initial field'''
		self.name = name
		self.device_system_name = device_system_name
		self.address = address
		self.read_only = read_only
		self.high = high
		self.low = low
		self.icon = icon
		self.type = type
		self.unit = unit
		self.enum_values = enum_values
		self.virtual_field = virtual_field
		# self.change = change
		self.__value = value

	def __str__(self):
		return str(self.name)

	def get(self):
		return self.__value
	
	def get_high(self):
		return self.high

	def get_low(self):
		return self.low

	def get_type(self):
		return self.type

	def get_unit(self):
		return self.unit

	def get_name(self):
		return self.name

	def set(self, status, script=True):
		self.__value = status
		if(script):
			pass
			# run_by_trigger_scripts(self.device_system_name,self.name)

	def dict(self)->Dict:
		return {
			"name": self.name,
			"address":self.address,
			"read_only":self.read_only,
			"high":self.high,
			"low":self.low,
			"icon":self.icon,
			"type":self.type,
			"unit":self.unit,
			"enum_values":", ".join(self.enum_values),
			"virtual_field": self.virtual_field,
			"value":self.__value,
		}
	
	def get_data(self)->FieldDeviceSchema:
		return FieldDeviceSchema(
			name=self.name,
			address=self.address,
			read_only=self.read_only,
			high=self.high,
			low=self.low,
			icon=self.icon,
			type=self.type,
			unit=self.unit,
			enum_values=self.enum_values,
			virtual_field=self.virtual_field,
			value=self.__value
		)

	# def get_allowed_fields(self)->ChangeField:
	# 	return self.change
