
from enum import Enum
from numbers import Number
from typing import Any, Dict, List
from app.ingternal.device.enums import TypeDeviceField
from app.ingternal.exceptions.base import InvalidInputException
from app.ingternal.device.interfaces.field_interface import IField
from app.ingternal.device.schemas.device import FieldDeviceSchema, AddDeviceFieldSchema
from app.ingternal.device.communication_fields.communications import CommunicationFields
from app.ingternal.device.schemas.communication_fields import TypeRelatedFields
from app.ingternal.device.device_data.device_data_array import DevicesDataArrey

from app.ingternal.device.set_value import set_value

from app.ingternal.automation.running.run_automation import automation_device_run

def getParams(d:Dict[str, Any], param:str, default:Any|None=None)->Any:
	if(param in d):
		return d[param]
	elif(not default):
		raise InvalidInputException("invalid fields data")
	else:
		return default

class BaseField(IField):
	""""""
	
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
		virtual_field: bool = False,
		entity: str = ""
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
		self.entity = entity
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
	
	def get_entity(self):
		return self.entity
	
	def get_address(self):
		return self.address
	
	def is_virtual_field(self) -> bool:
		return self.virtual_field
	
	def is_read_only(self) -> bool:
		return self.read_only

	def get_name(self):
		return self.name

	def set(self, status, script=True):
		self.__value = status
		DevicesDataArrey.updata_value(self.device_system_name, self.name, status)
		# feedback_fields_device = CommunicationFields.get_feedback_fields_device(self.device_system_name, self.name)
		# print(feedback_fields_device, self.device_system_name, self.__value)
		# if feedback_fields_device:
		# 	for field in feedback_fields_device:
		# 		if field.type == TypeRelatedFields.DEVICE:
		# 			print(field.system_name, field.field, status)
		# 			set_value(field.system_name, field.field, status, False)
		if(script):
			automation_device_run(self.device_system_name, self.name)
		
	def set_virtual_value(self, status, script=True):
		'''
		используется программой для виртуальных полей чтобы в них не записывались данные полученные от устройства.
		'''
		if not self.virtual_field:
			return
		self.__value = status
		if(script):
			pass

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
			"entity":self.entity
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
			enum_values=", ".join(self.enum_values),
			virtual_field=self.virtual_field,
			value=self.__value,
			entity=self.entity
		)
	
	def _get_initial_data(self)->AddDeviceFieldSchema:
		return AddDeviceFieldSchema(
			name=self.name,
			address=self.address,
			type=self.type,
			low=self.low,
			high=self.high,
			enum_values=", ".join(self.enum_values),
			read_only=self.read_only,
			icon=self.icon,
			unit=self.unit,
			virtual_field=self.virtual_field,
			entity=self.entity
		)

	# def get_allowed_fields(self)->ChangeField:
	# 	return self.change
