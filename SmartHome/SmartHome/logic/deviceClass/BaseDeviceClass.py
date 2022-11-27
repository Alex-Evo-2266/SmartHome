from typing import Any, List, TypeVar
from SmartHome.logic.deviceClass.schema import AdditionDevice, ChangeDevice
from SmartHome.logic.deviceFile.DeviceFile import DeviceData, DevicesFile
from SmartHome.logic.deviceClass.Fields.TypeField import TypeField
from SmartHome.logic.deviceFile.schema import DeviceFieldSchema, DeviceSchema
from SmartHome.logic.deviceClass.Fields.BaseField import BaseField
from exceptions.exceptions import DeviceNotFound, InvalidInputException
from SmartHome.logic.deviceClass.DeviceMeta import DefConfig, DeviceMeta
from SmartHome.models import DeviceHistory
import logging
from datetime import datetime
from moduls_src.models_schema import AddDevice


logger = logging.getLogger(__name__)

T = TypeVar("T")

def look_for_param(arr:List[T], name:str)->T|None:
	for item in arr:
		if(item.name == name):
			return(item)
	return None

class BaseDevice(metaclass=DeviceMeta):
	"""docstring for BaseDevice."""

	types=["base"]

	class Config(DefConfig):
		pass

	@staticmethod
	def get_change_rules():
		return ChangeDevice(address = BaseDevice.Config.address, token=BaseDevice.Config.token, fields=BaseDevice.Config.fields_change)
		
	@staticmethod
	def get_addition_rules():
		return AdditionDevice(address = BaseDevice.Config.address, token=BaseDevice.Config.token, fields=BaseDevice.Config.fields_addition)


	def __init__(self, system_name:str|None = None, device_data:DeviceData|None = None):
		if not system_name and not device_data:
			raise InvalidInputException("no data entered in constructor")
		if not device_data and system_name:
			self.device_data = DevicesFile.get(system_name)
		else:
			self.device_data = device_data
		if not self.device_data:
			raise DeviceNotFound()
		self.values:List[BaseField] = list()
		for item in device_data.fields:
			self.values.append(BaseField(**item.dict(), device_name=self.device_data.name))
		self.device = None		

	def get_value(self, name:str)->DeviceFieldSchema|None:
		value = look_for_param(self.values, name)
		if not value:
			return None
		return value.get_data()

	def get_field(self, name:str):
		return look_for_param(self.values, name)

	def get_values(self):
		res:List[DeviceFieldSchema] = []
		for item in self.values:
			res.append(item.get_data())
		return res

	@property
	def is_conected(self):
		'''
		if the device does not require a connection, then always "true"
		'''
		return True

	def get_device(self):
		return self.device

	def set_value(self, name:str, status:Any):
		value = look_for_param(self.values, name)
		if(value):
			if(value.type == TypeField.NUMDER):
				if(int(status) > int(value.high)):
					status = value.high
				if(int(status) < int(value.low)):
					status = value.low
			value.set(status, False)
		return status

	def save(self):
		if not self.device_data:
			raise DeviceNotFound()
		for item in self.values:
			value = look_for_param(self.device_data.fields, item.name)
			if value:
				value.value = item.get()
		self.device_data.save()
		logger.info(f'save {self.device_data.name}')

	async def save_and_addrecord(self):
		for item in self.values:
			value = look_for_param(self.device_data.fields, item.name)
			if value:
				value.value = item.get()
			if not value.unit:
				value.unit = ""
			if not value.value:
				value.value = "0"
			await DeviceHistory.objects.create(deviceName=self.device_data.systemName, field=item.name, type=item.type, value=value.value, unit=value.unit, datatime=datetime.now().timestamp())
		self.device_data.save()
		logger.info(f'save history {self.device_data.name}')

	def get_info(self)->DeviceSchema:
		res = DeviceSchema(
			address=self.device_data.address,
			information=self.device_data.information,
			name=self.device_data.name,
			status=self.device_data.status,
			system_name=self.device_data.system_name,
			token=self.device_data.token,
			type=self.device_data.type,
			class_device=self.device_data.class_device,
			value_type=self.device_data.value_type,
			fields=[],
			value=None
			)
		values:List[DeviceFieldSchema] = []
		vals = dict()
		for item in self.values:
			values.append(item.get_data())
			vals[item.name] = item.get()
		res.fields = values
		res.value = vals
		return res

	def updata(self):
		pass
