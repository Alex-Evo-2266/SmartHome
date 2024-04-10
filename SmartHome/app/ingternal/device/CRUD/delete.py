from app.ingternal.device.models.device import Device
from app.ingternal.device.exceptions.device import DeviceNotFound

async def delete_device(system_name:str):
	device = await Device.objects.get_or_none(system_name=system_name)
	if not device:
		raise DeviceNotFound()
	await device.delete()