from typing import Any, List, TypeVar, Optional, Dict
from app.ingternal.device.models.device import Device, Device_field, Value
from app.ingternal.device.device_class.DeviceMeta import DeviceMeta
from app.ingternal.device.schemas.device_class import ConfigSchema, ChangeDevice, AdditionDevice
from app.ingternal.device.device_class.BaseField import BaseField
from app.ingternal.device.enums import TypeDeviceField, ReceivedDataFormat, StatusDevice
from app.ingternal.device.schemas.device import DeviceSchema, FieldDeviceSchema
from app.ingternal.device.interfaces.device_interface import IDevice

from app.ingternal.device.exceptions.device import DeviceNotFound
from app.ingternal.exceptions.base import InvalidInputException
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

T = TypeVar("T")

def look_for_param(arr:List[T], name:str)->T|None:
	for item in arr:
		if(item.name == name):
			return(item)
	return None

def get_enum_values(s:str | None):
	if not s:
		return []
	arr = s.split(",")
	for index, item in enumerate(arr):
		arr[index] = item.strip()
	return arr

class BaseDevice(IDevice, metaclass=DeviceMeta, use=False):
	"""docstring for BaseDevice."""

	types=[]

	class Config(ConfigSchema):
		pass

	@classmethod
	def get_change_rules(cls):
		return ChangeDevice(address = cls.Config.address, token=cls.Config.token, fields=cls.Config.fields_change)
		
	@classmethod
	def get_addition_rules(cls):
		return AdditionDevice(address = cls.Config.address, token=cls.Config.token, fields=cls.Config.fields_addition)


	def __init__(
			self, 
			name:str,
			system_name: str,
			class_device: str,
			type: str,
			fields: List[Device_field],
			address: Optional[str] = None,
			token: Optional[str] = None,
			type_command: ReceivedDataFormat = ReceivedDataFormat.JSON,
			device_polling: bool = True,
			device_status: Optional[StatusDevice] = StatusDevice.OFFLINE,
			value: Optional[Dict[str,str]] = dict()
			):
		if not system_name or system_name == "":
			raise InvalidInputException("no data entered in constructor")
		self.name = name
		self.system_name = system_name
		self.class_device = class_device
		self.type = type
		self.fields = fields
		self.address = address
		self.token = token
		self.type_command = type_command
		self.device_polling = device_polling
		self.values:List[BaseField] = []
		for item in self.fields:
			field_data = item.dict(exclude={"id", "device"})
			field_data["enum_values"] = get_enum_values(item.enum_values)
			self.values.append(BaseField(**field_data, device_system_name=self.system_name))
		self.device = None		

	def get_value(self, name:str)->Dict[str, str] | None:
		value: BaseField | None = look_for_param(self.values, name)
		if not value:
			return None
		return value.dict()

	def get_field(self, name:str):
		return look_for_param(self.values, name)

	def get_values(self)->List[Dict[str, str]]:
		res:List[Dict[str, str]] = []
		for item in self.values:
			res.append(item.dict())
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
			if(value.get_type() == TypeDeviceField.NUMBER):
				if(int(status) > int(value.get_high())):
					status = value.get_high()
				if(int(status) < int(value.get_low())):
					status = value.get_low()
			value.set(status, False)
		return status

	async def save(self):
		# device_obj = await Device.objects.get_or_none(system_name=self.system_name)
		# if not device_obj:
		# 	raise DeviceNotFound()
		dev_fields:List[Device_field] = await Device_field.objects.all(device__system_name=self.system_name)
		for item in self.values:
			field = look_for_param(dev_fields, item.get_name())
			if field:
				field_data = item.dict()
				await Value.objects.create(field=field, datatime=datetime.now().timestamp(), value=item.get())
				await field.update(unit=field_data["unit"], high=field_data["high"], low=field_data["low"], read_only=field_data['read_only'], icon=field_data['icon'])
		logger.info(f'save {self.system_name}')

	async def save_and_addrecord(self):
		await self.save()
		# if not self.device_data:
		# 	raise DeviceNotFound()
		# for item in self.values:
		# 	value = look_for_param(self.device_data.fields, item.get_name())
		# 	if not value:
		# 		continue
		# 	if value:
		# 		value.value = item.get()
		# 	if not value.unit:
		# 		value.unit = ""
		# 	if not value.value:
		# 		value.value = "0"
		# 	await DeviceHistory.objects.create(deviceName=self.device_data.system_name, field=item.get_name(), type=item.get_type(), value=value.value, unit=value.unit, datatime=datetime.now().timestamp())
		# self.device_data.save()
		# logger.info(f'save history {self.device_data.name}')

	def dict(self)->Dict[str, str]:
		if not self.device_data:
			raise DeviceNotFound()
		res = {
			"address":self.address,
			"name":self.name,
			"device_polling":self.device_polling,
			"system_name":self.system_name,
			"token":self.token,
			"type":self.type,
			"class_device":self.class_device,
			"type_command":self.type_command,
			"fields":[],
			"value":{}
		}
		values:List[Dict[str, str]] = []
		vals: Dict[str, str] = dict()
		for item in self.values:
			values.append(item.dict())
			vals[item.get_name()] = item.get()
		res.fields = values
		res.value = vals
		return res
	
	def get_data(self)->DeviceSchema:
		res = DeviceSchema(
			name=self.name,
			system_name=self.system_name,
			class_device=self.class_device,
			type=self.type,
			address=self.address,
			token=self.token,
			type_command=self.type_command,
			device_polling=self.device_polling,
		)
		values:List[FieldDeviceSchema] = []
		vals: Dict[str, str] = dict()
		for item in self.values:
			values.append(item.get_data())
			vals[item.get_name()] = item.get()
		res.fields = values
		res.value = vals
		return res

	def updata(self):
		pass
