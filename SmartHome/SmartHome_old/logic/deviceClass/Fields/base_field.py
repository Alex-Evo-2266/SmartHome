from SmartHome.logic.script.run_script import run_by_trigger_scripts

from enum import Enum
from numbers import Number
from typing import Any, Dict, List
from SmartHome.logic.deviceClass.schema import ChangeField
from SmartHome.logic.deviceClass.Fields.TypeField import TypeField
from exceptions.exceptions import InvalidInputException
from SmartHome.logic.deviceFile.schema import DeviceFieldSchema
from SmartHome.logic.deviceClass.Fields.FieldInterface import IField
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
		device_name:str, 
		address:str|None = None, 
		control:bool = False, 
		high:str|None = None, 
		low:str|None = None,
		icon:str = "fas fa-circle-notch",
		type:TypeField = TypeField.BASE,
		unit:str = "",
		enum_values:List[str] = [],
		value:Any = None,
		# change:ChangeField = ChangeField()
		):
		'''initial field'''
		self.name = name
		self.device_name = device_name
		self.address = address
		self.control = control
		self.high = high
		self.low = low
		self.icon = icon
		self.type = type
		self.unit = unit
		self.enum_values = enum_values
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
			run_by_trigger_scripts(self.device_name,self.name)

	def get_data(self)->DeviceFieldSchema:
		return DeviceFieldSchema(
			name=self.name,
			address=self.address,
			control=self.control,
			high=self.high,
			low=self.low,
			icon=self.icon,
			type=self.type,
			unit=self.unit,
			enum_values=", ".join(self.enum_values),
			value=self.__value,
		)

	# def get_allowed_fields(self)->ChangeField:
	# 	return self.change
