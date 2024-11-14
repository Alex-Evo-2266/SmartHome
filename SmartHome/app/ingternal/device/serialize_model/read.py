from typing import List
from app.ingternal.device.models.device import Device, DeviceField
from app.ingternal.device.schemas.device import DeviceSerializeSchema
from app.ingternal.device.arrays.DeviceDataArray import DevicesDataArrey
from app.ingternal.device.exceptions.device import DeviceNotFound

from app.ingternal.device.serialize_model.device_serialize import serialize_device

async def get_all_device():
	# devices: List[Device] = await Device.objects.all()
	# arr:List[DeviceSchema] = []
	arr = DevicesDataArrey.get_all_device()
	return arr
	
async def get_device(system_name: str):
	device_data = DevicesDataArrey.get(system_name)
	if device_data:
		return device_data.device
	raise DeviceNotFound()

async def get_serialize_device(system_name: str) -> DeviceSerializeSchema:
	device = await Device.objects.get_or_none(system_name=system_name)
	if not device:
		raise DeviceNotFound()
	return await serialize_device(device, fields_include=True)

async def get_serialize_field(system_name: str, field_name: str):
	device = await get_serialize_device(system_name)
	if not device:
		raise DeviceNotFound()
	for field in device.fields:
		if field.name == field_name:
			return field
	raise DeviceNotFound()

async def get_serialize_field_by_id(system_name: str, field_id: str):
	device = await get_serialize_device(system_name)
	if not device:
		raise DeviceNotFound()
	for field in device.fields:
		if field.id == field_id:
			return field
	raise DeviceNotFound()