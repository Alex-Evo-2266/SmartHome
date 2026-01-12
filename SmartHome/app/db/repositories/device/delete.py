from app.db.models.device.device import Device
from app.exceptions.device import DeviceNotFound
from app.db.repositories.device.delete_type import delete_type_device_by_device
from app.db.cache.room.all_rooms import invalidate_cache_room__type_device_data
from typing import Optional
from app.db.cache.device.invalidate_cache import invalidate_cache
from app.core.state.get_store import get_container

async def delete_device(system_name:str):
	device = await Device.objects.get_or_none(system_name=system_name)
	if not device:
		raise DeviceNotFound()
	await device.delete()
	get_container().device_store.remove_device(system_name)
	get_container().connect_store.delete(system_name)
	invalidate_cache()
	invalidate_cache_room__type_device_data()
	await delete_type_device_by_device(system_name)
