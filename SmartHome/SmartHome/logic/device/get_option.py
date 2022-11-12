
from typing import List
from SmartHome.logic.deviceClass.schema import AdditionDevice, ChangeDevice, ChangeField, OptionalDevice
from SmartHome.logic.deviceClass.DeviceClasses import DeviceClasses
from SmartHome.logic.deviceClass.BaseDeviceClass import BaseDevice
from SmartHome.logic.deviceClass.VariableClass import Variable


def get_option():
	arr:List[OptionalDevice] = []
	devece_calsses = DeviceClasses.all()
	for key in devece_calsses:
		_class:BaseDevice = devece_calsses[key]
		option = _class.Config
		added = AdditionDevice(address=option.address, token=option.token, fields=option.fields_addition)
		change = ChangeDevice(address=option.address, token=option.token, fields=option.fields_change)
		arr.append(OptionalDevice(class_name=key, added=added, change=change))
	return arr
	