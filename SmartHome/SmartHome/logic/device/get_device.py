

import logging
from typing import List
from SmartHome.logic.deviceClass.DeviceClasses import DeviceClasses
from SmartHome.logic.deviceFile.DeviceFile import DeviceData, DevicesFile
from SmartHome.logic.deviceClass.BaseDeviceClass import BaseDevice

logger = logging.getLogger(__name__)

def get_device(device_data: DeviceData):
	logger.debug("get_device function")
	device:BaseDevice = DeviceClasses.get_device(device_data.class_device, device_data=device_data)
	logger.info(device.is_conected)

def get_all_device():
	devices = DevicesFile.all()
	arr:List[DeviceData] = []
	for item in devices:
		device = get_device(item)
		if not device:
			raise
		arr.append(device)
	return arr
	