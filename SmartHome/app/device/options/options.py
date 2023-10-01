from typing import List
from app.device.options.schemas import AdditionDevice, ChangeDevice, OptionsDevice
from app.device.device_class.DeviceClasses import DeviceClasses
from app.device.device_class.BaseDeviceClass import BaseDevice

def get_option():
	arr: List[OptionsDevice] = []
	devece_calsses = DeviceClasses.all()
	for key in devece_calsses:
		_class:BaseDevice = devece_calsses[key]
		option = _class.Config
		added = AdditionDevice(address=option.address, token=option.token, fields=option.fields_addition)
		change = ChangeDevice(address=option.address, token=option.token, fields=option.fields_change)
		arr.append(OptionsDevice(class_name=key, added=added, change=change, types=_class.types, added_url=option.added_url, change_url=option.change_url))
	return arr
	