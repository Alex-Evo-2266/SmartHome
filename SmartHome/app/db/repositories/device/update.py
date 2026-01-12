from typing import Optional, List

from app.core.state.get_store import get_container

from app.schemas.device.edit_device import EditDeviceSchema
from app.schemas.device.add_device import AddDeviceFieldSchema
from app.db.models.device.device import Device
from app.db.repositories.device.edit_field import edit_fields as ef
from app.exceptions.device import DeviceNotFound
from app.db.repositories.device.utils.utils import duble_field
from app.schemas.device.enums import DeviceStatusField, ReceivedDataFormat, DeviceGetData
from app.db.cache.device.invalidate_cache import invalidate_cache, invalidate_cache_device_data_by_device
from app.db.cache.room.all_rooms import invalidate_cache_room__type_device_data
from app.db.repositories.room.get_room import is_room_exists
from app.pkg.runtime.queue import __queue__
from app.core.entities.device.device_queue.types import InitDeviceItem

from app.pkg.logger import get_base_logger

# Настройка логгера
logger = get_base_logger.get_logger(__name__)

async def edit_device(system_name: str, data: EditDeviceSchema, *, init_device: bool = True):
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
	if is_room_exists(data.room):
		device.room = data.room
	else:
		device.room = None
	await device.update(_columns=["system_name", "name", "type", "address", "token", "type_command", "type_get_data", "type_get_data", "room"])
	invalidate_cache_device_data_by_device(system_name)
	invalidate_cache()
	invalidate_cache_room__type_device_data()
	get_container().connect_store.delete(system_name)
	if init_device:
		__queue__.add("init_device", system_name=system_name, try_count=0)
	 # Удаление из кэша
	  
async def edit_fields(system_name: str, data: List[AddDeviceFieldSchema], *, init_device: bool = True):
	"""редактирование только полей устройства"""
	device: Optional[Device] = await Device.objects.get_or_none(system_name=system_name)

	if not device:
		raise DeviceNotFound()
	
	await duble_field(data, system_name)
	await ef(device, data)
	invalidate_cache_device_data_by_device(system_name)
	invalidate_cache()
	invalidate_cache_room__type_device_data()
	get_container().connect_store.delete(system_name)
	if init_device:
		__queue__.add("init_device", system_name=system_name, try_count=0)

	 # Удаление из кэша


# async def edit_status_device(system_name: str, status: bool):
# 	"""Редактирование статуса устройства."""
# 	device: Optional[Device] = await Device.objects.get_or_none(system_name=system_name)
	
# 	if not device:
# 		raise DeviceNotFound()

# 	device.status = DeviceStatusField.LINK if status else DeviceStatusField.UNLINK
	
# 	await device.update(_columns=["status"])
	
# 	DevicesArray.delete(system_name)

async def edit_status_device(system_name: str, status: bool, *, init_device: bool = True):
	"""Редактирование статуса устройства."""
	try:
		status_str = "LINK" if status else "UNLINK"
		logger.info(f"Starting status change for device: {system_name}, new status: {status_str}")
		
		device: Optional[Device] = await Device.objects.get_or_none(system_name=system_name)
		
		if not device:
			logger.error(f"Device not found for status update: {system_name}")
			raise DeviceNotFound()

		device.status = DeviceStatusField.LINK if status else DeviceStatusField.UNLINK
		
		await device.update(_columns=["status"])
		
		logger.debug(f"Clearing cache for device: {system_name}")
		get_container().connect_store.delete(system_name)
		invalidate_cache()
		invalidate_cache_room__type_device_data()
		if init_device:
			__queue__.add("init_device", system_name=system_name, try_count=0)
		
		logger.info(f"Successfully updated status for device: {system_name} to {status_str}")
	except Exception as e:
		logger.error(f"Error updating status for device {system_name}: {str(e)}", exc_info=True)
		raise

async def update_device_from_object(system_name:str, status:bool, type_command:ReceivedDataFormat, type_get_data:DeviceGetData, token:str, address:str, *, init_device: bool = True):
	"""Редактирование устройства."""
	device: Optional[Device] = await Device.objects.get_or_none(system_name=system_name)

	if not device:
		raise DeviceNotFound()

	# Обновление устройства
	device.address = address
	device.token = token
	device.type_get_data = type_get_data
	device.type_command = type_command
	# device.status = status  # пока что закоментировал чтобы корректно работало ручное изменение состояния у отключенных устройств.
	await device.update(_columns=["address", "token", "type_command", "type_get_data", "status"])
	invalidate_cache()
	invalidate_cache_room__type_device_data()
	get_container().connect_store.delete(system_name)
	if init_device:
		__queue__.add("init_device", system_name=system_name, try_count=0)

	 # Удаление из кэша
	# DevicesArray.delete(system_name)