from typing import List
import logging
from app.db.models.device.device import Device, DeviceField
from app.schemas.device.device import DeviceSerializeSchema, DeviceSchema
from app.exceptions.device import DeviceNotFound
from app.db.mappers.device.device_serialize import serialize_device
from app.core.state.get_store import get_container

from app.pkg.logger import get_base_logger

# Настройка логгера
logger = get_base_logger.get_logger(__name__)

# Fetch all devices from the service data poll
async def get_all_device():
	"""
	Fetch all devices from the service data poll.
	Возвращает все устройства из структуры данных.
	
	Returns:
		List: List of devices if found, else an empty list.
	"""
	logger.debug("Fetching all devices from service data poll...")  # Log debug
	snapshots = get_container().device_store.get_all_snapshots()
	devices = [DeviceSchema(**x.description.model_dump(), value=x.state) for x in snapshots]

	logger.debug(f"Found {len(devices)} devices.")  # Log the number of devices found
	return devices

# Helper function to filter out None or empty values
def filter_fun(data):
	"""
	Filters out None or empty values.
	Фильтрует пустые или None значения.
	
	Args:
		data: The data to filter.
	
	Returns:
		bool: True if data is not None or empty, False otherwise.
	"""
	return bool(data)

# Fetch and serialize all devices from the database
async def get_all_row_device(fields_include=True):
	"""
	Fetch all devices from the database, serialize them, and filter the valid ones.
	Извлекает все устройства из базы данных, сериализует и фильтрует их.
	
	Returns:
		List: List of serialized devices.
	"""
	logger.debug("Fetching all devices from the database...")  # Log debug
	devices: List[Device] = await Device.objects.all()

	logger.debug(f"Fetched {len(devices)} devices from the database.")  # Log the number of devices fetched
	serialized_devices = list(filter(filter_fun, [
		await serialize_device(device, fields_include=fields_include) for device in devices
	]))
	logger.debug(f"Serialized and filtered {len(serialized_devices)} devices.")  # Log the number of serialized devices
	return serialized_devices

# Fetch a specific device by system name from the service data poll
async def get_device(system_name: str):
	"""
	Fetch a device by its system name from the service data poll.
	Извлекает устройство по его системному имени из структуры данных.
	
	Args:
		system_name: The system name of the device to fetch.
	
	Returns:
		Device: The device if found, raises DeviceNotFound if not.
	"""
	logger.debug(f"Fetching device with system name: {system_name}...")  # Log debug
	snapshots = get_container().device_store.get_snapshot(system_name)
	device = DeviceSchema(**snapshots.description.model_dump(), value=snapshots.state)
	
	if device:
		logger.debug(f"Device {system_name} found.")  # Log successful device retrieval
		return device

	logger.error(f"Device with system name {system_name} not found.")  # Log error if not found
	raise DeviceNotFound()

# Fetch and serialize a device by system name
async def get_serialize_device(system_name: str) -> DeviceSerializeSchema:
	"""
	Fetch and serialize a device by its system name.
	Извлекает и сериализует устройство по его системному имени.
	
	Args:
		system_name: The system name of the device to serialize.
	
	Returns:
		DeviceSerializeSchema: The serialized device.
	
	Raises:
		DeviceNotFound: If the device is not found.
	"""
	logger.debug(f"Fetching and serializing device with system name: {system_name}...")  # Log debug
	device = await Device.objects.get_or_none(system_name=system_name)

	if not device:
		logger.error(f"Device with system name {system_name} not found in the database.")  # Log error if not found
		raise DeviceNotFound()

	logger.debug(f"Device {system_name} serialized successfully.")  # Log success
	return await serialize_device(device, fields_include=True)

# Fetch and return a specific field by name from a serialized device
async def get_serialize_field(system_name: str, field_name: str):
	"""
	Fetch a specific field by name from a serialized device.
	Извлекает конкретное поле по имени из сериализованного устройства.
	
	Args:
		system_name: The system name of the device.
		field_name: The name of the field to retrieve.
	
	Returns:
		DeviceField: The field if found.
	
	Raises:
		DeviceNotFound: If the field or device is not found.
	"""
	logger.debug(f"Fetching field {field_name} from device {system_name}...")  # Log debug
	device = await get_serialize_device(system_name)

	# Search for the field by name
	for field in device.fields:
		if field.name == field_name:
			logger.debug(f"Field {field_name} found in device {system_name}.")  # Log success
			return field

	logger.error(f"Field {field_name} not found in device {system_name}.")  # Log error if not found
	raise DeviceNotFound()

# Fetch and return a specific field by ID from a serialized device
async def get_serialize_field_by_id(system_name: str, field_id: str):
	"""
	Fetch a specific field by ID from a serialized device.
	Извлекает конкретное поле по ID из сериализованного устройства.
	
	Args:
		system_name: The system name of the device.
		field_id: The ID of the field to retrieve.
	
	Returns:
		DeviceField: The field if found.
	
	Raises:
		DeviceNotFound: If the field or device is not found.
	"""
	logger.debug(f"Fetching field with ID {field_id} from device {system_name}...")  # Log debug
	device = await get_serialize_device(system_name)

	# Search for the field by ID
	for field in device.fields:
		if field.id == field_id:
			logger.debug(f"Field with ID {field_id} found in device {system_name}.")  # Log success
			return field

	logger.error(f"Field with ID {field_id} not found in device {system_name}.")  # Log error if not found
	raise DeviceNotFound()