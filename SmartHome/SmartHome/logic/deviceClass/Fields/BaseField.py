# from SmartHome.logic.script.runScript import runScripts

from enum import Enum
from numbers import Number
from typing import Any, Dict, List
from SmartHome.logic.deviceClass.schema import ChangeField
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

class BaseField(object):
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

	def set(self, status, script=True):
		self.__value = status
		if(script):
			pass
			# runScripts(self.device_name,self.name)

	def get_data(self)->DeviceFieldSchema:
		print("d0")
		return DeviceFieldSchema(
			name=self.name,
			address=self.address,
			control=self.control,
			high=self.high,
			low=self.low,
			icon=self.icon,
			type=self.type,
			unit=self.unit,
			enum_values=self.enum_values,
			value=self.__value,
		)

	# def get_allowed_fields(self)->ChangeField:
	# 	return self.change
