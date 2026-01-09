from app.ingternal.device.models.device import Device
from app.ingternal.device.exceptions.device import DeviceNotFound
from app.ingternal.device.arrays.DevicesArray import DevicesArray
from app.ingternal.modules.arrays.serviceDataPoll import servicesDataPoll, ObservableDict
from app.ingternal.device_types.serialize_model.delete import delete_type_device_by_device
from app.ingternal.room.cache.all_rooms import invalidate_cache_room__type_device_data
from typing import Optional
from app.ingternal.device.cache.invalidate_cache import invalidate_cache
from app.ingternal.modules.struct.DeviceStatusStore import store

async def delete_device(system_name:str):
	device = await Device.objects.get_or_none(system_name=system_name)
	if not device:
		raise DeviceNotFound()
	DevicesArray.delete(system_name)
	await device.delete()
	store.remove_device(system_name)
	invalidate_cache()
	invalidate_cache_room__type_device_data()
	await delete_type_device_by_device(system_name)
