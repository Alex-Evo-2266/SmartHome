

import logging
from typing import List
from SmartHome.logic.device.devices_arrey import DevicesArrey
from SmartHome.logic.deviceFile.schema import DeviceSchema, Status_Device
from SmartHome.logic.deviceClass.DeviceClasses import DeviceClasses
from SmartHome.logic.deviceFile.DeviceFile import DeviceData, DevicesFile
from SmartHome.logic.deviceClass.BaseDeviceClass import BaseDevice

logger = logging.getLogger(__name__)

def get_device_data(device_data: DeviceData):
	try:
		logger.debug("get_device function")
		device:BaseDevice
		if not device_data:
			raise Exception("data not found")
		if device_data.status == Status_Device.UNLINC:
			data = device_data
			data.value = dict()
			return data
		element = DevicesArrey.get(device_data.system_name)
		if not element:
			device:BaseDevice = DeviceClasses.get_device(device_data.class_device, device_data=device_data)
			if not device:
				data = device_data
				data.value = dict()
				data.status = Status_Device.NOT_SUPPORTED
				return data
			if not device.is_conected:
				data = device_data
				data.status = Status_Device.OFFLINE
				data.value = dict()
				return data
			DevicesArrey.addDevice(device_data.system_name,device)
		else:
			device = element.device
		device.updata()
		data = device.get_info()
		data.status = Status_Device.ONLINE
		return data
	except Exception as e:
		logger.warning(f'device not found. {e}')
		element = DevicesArrey.get(device_data.system_name)
		if element:
			DevicesArrey.delete(device_data.systemName)
		data = device_data
		data.status = Status_Device.OFFLINE
		data.value = dict()
		return data
		

def get_all_device():
	devices = DevicesFile.all()
	arr:List[DeviceData] = []
	for item in devices:
		device = get_device_data(item)
		if not device:
			raise
		arr.append(device)
	return arr
	
def get_device(sysyem_name: str):
	device = DevicesFile.get(sysyem_name)
	if device:
		return get_device_data(device)
	return None
	