from typing import Optional, List

from app.ingternal.device.schemas.edit_device import EditDeviceSchema
from app.ingternal.device.schemas.add_device import AddDeviceFieldSchema
from app.ingternal.device.models.device import Device
from app.ingternal.device.serialize_model.edit_field import edit_fields as ef
from app.ingternal.device.exceptions.device import DeviceNotFound
from app.ingternal.device.arrays.DevicesArray import DevicesArray
from app.ingternal.device.serialize_model.utils import duble_field
from app.ingternal.device.schemas.enums import DeviceStatusField, ReceivedDataFormat, DeviceGetData


async def edit_device(system_name: str, data: EditDeviceSchema):
	"""Редактирование устройства."""
	device: Optional[Device] = await Device.objects.get_or_none(system_name=system_name)

	if not device:
		raise DeviceNotFound()
	
	await duble_field(data.fields, data.system_name)
	await ef(device, data.fields)

	# Обновление устройства
	device.system_name = data.system_name
	device.name = data.name
	device.type = data.type
	device.address = data.address
	device.token = data.token
	device.type_command = data.type_command
	device.type_get_data = data.type_get_data
	await device.update(_columns=["system_name", "name", "type", "address", "token", "type_command", "type_get_data", "type_get_data"])

	 # Удаление из кэша
	DevicesArray.delete(system_name)
	  
async def edit_fields(system_name: str, data: List[AddDeviceFieldSchema]):
	"""редактирование только полей устройства"""
	device: Optional[Device] = await Device.objects.get_or_none(system_name=system_name)

	if not device:
		raise DeviceNotFound()
	
	await duble_field(data, system_name)
	await ef(device, data)

	 # Удаление из кэша
	DevicesArray.delete(system_name)


async def edit_status_device(system_name: str, status: bool):
	"""Редактирование статуса устройства."""
	device: Optional[Device] = await Device.objects.get_or_none(system_name=system_name)
	
	if not device:
		raise DeviceNotFound()

	device.status = DeviceStatusField.LINK if status else DeviceStatusField.UNLINK
	
	await device.update(_columns=["status"])
	
	DevicesArray.delete(system_name)

async def update_device_from_object(system_name:str, status:bool, type_command:ReceivedDataFormat, type_get_data:DeviceGetData, token:str, address:str):
	"""Редактирование устройства."""
	device: Optional[Device] = await Device.objects.get_or_none(system_name=system_name)

	if not device:
		raise DeviceNotFound()

	# Обновление устройства
	device.address = address
	device.token = token
	device.type_get_data = type_get_data
	device.type_command = type_command
	device.status = status
	await device.update(_columns=["address", "token", "type_command", "type_get_data", "status"])

	 # Удаление из кэша
	DevicesArray.delete(system_name)