from typing import List
from app.ingternal.device.models.device import Device
from app.ingternal.device.schemas.device import DeviceSchema
from app.ingternal.device.device_data.polling import polling_and_init, polling_all_and_init
from app.ingternal.device.exceptions.device import DeviceNotFound

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