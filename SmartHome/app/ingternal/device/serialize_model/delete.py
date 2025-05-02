from app.ingternal.device.models.device import Device
from app.ingternal.device.exceptions.device import DeviceNotFound
from app.ingternal.device.arrays.DevicesArray import DevicesArray
from app.ingternal.modules.arrays.serviceDataPoll import servicesDataPoll, ObservableDict
from app.ingternal.device_types.serialize_model.delete import delete_type_device_by_device
from app.configuration.settings import DEVICE_DATA_POLL
from typing import Optional
from app.ingternal.device.get_cached_device_data import invalidate_cache_device_data

async def delete_device(system_name:str):
	device = await Device.objects.get_or_none(system_name=system_name)
	if not device:
		raise DeviceNotFound()
	DevicesArray.delete(system_name)
	await device.delete()
	device_data_list:ObservableDict = servicesDataPoll.get(DEVICE_DATA_POLL)
	if not device_data_list:
		return
	device_data_list.delete(system_name)
	invalidate_cache_device_data()
	await delete_type_device_by_device(system_name)
