import logging
from pydantic import BaseModel
from typing import Any, List, TypeVar
from app.ingternal.device.schemas.device import DeviceSchema, FieldDeviceSchema
from datetime import datetime

logger = logging.getLogger(__name__)

def look_for_name(arr:List[FieldDeviceSchema], name:str)->FieldDeviceSchema|None:
	for item in arr:
		if(item.name == name):
			return(item)
	return None

def replace_value_in_field(arr:List[FieldDeviceSchema], name:str, value):
	for index, item in enumerate(arr):
		if(item.name == name):
			field_index = index
	if field_index != None:
		arr[field_index].value = value
	return arr

class DevicesDataArreyItem(BaseModel):
	system_name:str
	time_updata:datetime
	device: DeviceSchema

class DevicesDataArrey():
	devices_data:List[DevicesDataArreyItem] = []

	@classmethod
	def add(cls, device:DeviceSchema):
		for item in cls.devices_data:
			if(item.system_name==device.system_name):
				return None
		cls.devices_data.append(DevicesDataArreyItem(system_name=device.system_name, device=device, time_updata=datetime.now()))
		return cls.devices_data

	@classmethod
	def add_or_updata(cls, device:DeviceSchema):
		index_device:int | None = None
		for index, item in enumerate(cls.devices_data):
			if(item.system_name==device.system_name):
				index_device = index
				break
		if index_device != None:
			cls.devices_data[index_device] = DevicesDataArreyItem(system_name=device.system_name, device=device, time_updata=datetime.now())
		else:
			cls.devices_data.append(DevicesDataArreyItem(system_name=device.system_name, device=device, time_updata=datetime.now()))
		return cls.devices_data
	
	@classmethod
	def updata_value(cls, system_name, field_name, value):
		data = cls.get(system_name)
		data:DeviceSchema = data.device
		fields = replace_value_in_field(data.fields, field_name, value)
		data.value[field_name] = value
		cls.add_or_updata(data)

	@classmethod
	def all(cls):
		return cls.devices_data

	@classmethod
	def get_all_device(cls)->List[DeviceSchema]:
		return [x.device for x in cls.devices_data]

	@classmethod
	def delete(cls, system_name:str):
		try:
			for item in cls.devices_data:
				if(item.system_name==system_name):
					ret = item
					cls.devices_data.pop(cls.devices_data.index(item))
					return ret
			return None
		except Exception as e:
			logger.error(f"delete device from device list. {e}")
			return None

	@classmethod
	def get(cls, system_name:str)->DevicesDataArreyItem|None:
		for item in cls.devices_data:
			if(item.system_name==system_name):
				return item
		return None

