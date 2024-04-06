from app.ingternal.device.schemas.device import AddDeviceSchema, EditDeviceSchema, AddDeviceFieldSchema, DeviceSchema
from app.ingternal.device.models.device import Device, Device_field
from app.ingternal.device.exceptions.device import DeviceNotFound, DuplicateFieldsException
from typing import List, Optional
from app.ingternal.device.polling import polling_and_init, polling_all_and_init
from app.ingternal.device.edit_field import edit_fields
from app.ingternal.device.devices_arrey import DevicesArrey


async def duble_field(fields: List[AddDeviceFieldSchema], system_name: Optional[str] = None):
	field_names = []
	for field in fields:
		if field.name in field_names:
			if not system_name:
				raise DuplicateFieldsException()
			raise DuplicateFieldsException(f"duplicate fields in {system_name}")
		field_names.append(field.name)

async def get_all_device():
	devices: List[Device] = await Device.objects.all()
	arr:List[DeviceSchema] = []
	arr = await polling_all_and_init(devices)
	return arr
	
async def get_device(system_name: str):
	device = await Device.objects.get_or_none(system_name=system_name)
	if device:
		return await polling_and_init(device)
	raise DeviceNotFound()

async def get_device_row(system_name: str)->Device:
	device = await Device.objects.get_or_none(system_name=system_name)
	if device:
		return device
	raise DeviceNotFound()

async def get_field_row(system_name: str, field_name: str)->Device_field:
	device = await get_device_row(system_name)
	fields:Device_field = await Device_field.objects.get_or_none(device=device, name=field_name)
	if fields:
		return fields
	raise DeviceNotFound()

async def add_device(data: AddDeviceSchema):
	await duble_field(data.fields, data.system_name)
	new_device = await Device.objects.create(**(data.dict()))
	for field in data.fields:
		await Device_field.objects.create(**(field.dict()), device=new_device)

async def edit_device(system_name: str, data: EditDeviceSchema):
	device: Device | None = await Device.objects.get_or_none(system_name=system_name)
	if not device:
		raise DeviceNotFound()
	print(data)
	await duble_field(data.fields, data.system_name)
	await edit_fields(device, data.fields)
	await device.update(**(data.dict()))
	DevicesArrey.delete(system_name)

async def delete_device(system_name:str):
	device = await Device.objects.get_or_none(system_name=system_name)
	if not device:
		raise DeviceNotFound()
	await device.delete()