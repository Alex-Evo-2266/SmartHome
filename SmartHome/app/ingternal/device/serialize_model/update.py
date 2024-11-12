from app.ingternal.device.schemas.edit_device import EditDeviceSchema
from app.ingternal.device.models.device import Device
from app.ingternal.device.serialize_model.edit_field import edit_fields
from app.ingternal.device.exceptions.device import DeviceNotFound
from app.ingternal.device.arrays.DevicesArrey import DevicesArrey
from app.ingternal.device.serialize_model.utils import duble_field

async def edit_device(system_name: str, data: EditDeviceSchema):
	device: Device | None = await Device.objects.get_or_none(system_name=system_name)
	if not device:
		raise DeviceNotFound()
	print(data)
	await duble_field(data.fields, data.system_name)
	await edit_fields(device, data.fields)
	await device.update(**(data.dict()))
	DevicesArrey.delete(system_name)