from typing import List
from app.device.options.schemas import AdditionDevice, ChangeDevice, OptionsDevice
from app.device.device_class.DeviceClasses import DeviceClasses
from app.device.device_class.BaseDeviceClass import BaseDevice
from app.settings import MODULES_URL

import os

def get_option():
	arr: List[OptionsDevice] = []
	devece_calsses = DeviceClasses.all()
	for key in devece_calsses:
		_class:BaseDevice = devece_calsses[key]
		option = _class.Config
		added = AdditionDevice(address=option.address, token=option.token, fields=option.fields_addition)
		change = ChangeDevice(address=option.address, token=option.token, fields=option.fields_change)
		class_img_url = None
		print(option.class_img)
		if (option.class_img):
			class_img_url = MODULES_URL + option.class_img
		arr.append(OptionsDevice(class_name=key, class_img_url = class_img_url, added=added, change=change, types=_class.types, added_url=option.added_url, change_url=option.change_url))
	return arr
	