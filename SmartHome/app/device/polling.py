import logging
from app.device.models import Device
from app.exceptions.exceptions import DeviceNotFound
from app.device.device_class.BaseDeviceClass import BaseDevice
from app.device.devices_arrey import DevicesArrey
from app.device.device_class.DeviceClasses import DeviceClasses
from app.device.enums import StatusDevice
from app.device.schemas import DeviceSchema, FieldDeviceSchema
from app.device.map import device_db_to_schema

from typing import List

logger = logging.getLogger(__name__)

async def polling(device_data: Device):
	try:
		logger.debug("get_device function")
		device:BaseDevice
		if not device_data:
			raise DeviceNotFound()
		if device_data.device_polling == False:
			data = await device_db_to_schema(device_data)
			data.value = dict()
			data.device_status = StatusDevice.UNLINC
			return data
		element = DevicesArrey.get(device_data.system_name)
		if not element:
			device:BaseDevice = DeviceClasses.get_device(device_data.class_device, data=device_data.dict())
			if not device:
				data = await device_db_to_schema(device_data)
				data.value = dict()
				data.device_status = StatusDevice.NOT_SUPPORTED
				return data
			if not device.is_conected:
				data = await device_db_to_schema(device_data)
				data.device_status = StatusDevice.OFFLINE
				data.value = dict()
				return data
			DevicesArrey.addDevice(device_data.system_name,device)
		else:
			device = element.device
		device.updata()
		data = device.get_data()
		data.device_status = StatusDevice.ONLINE
		return data
	except Exception as e:
		logger.warning(f'device not found. {e}')
		element = DevicesArrey.get(device_data.system_name)
		if element:
			DevicesArrey.delete(device_data.system_name)
		data = await device_db_to_schema(device_data)
		data.device_status = StatusDevice.OFFLINE
		data.value = dict()
		return data
		