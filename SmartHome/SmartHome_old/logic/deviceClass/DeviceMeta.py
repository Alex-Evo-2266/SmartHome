from typing import List
from exceptions.exceptions import InvalidAttributeException
from SmartHome.logic.deviceClass.schema import AdditionDevice, ChangeDevice, ChangeField, ConfigSchema
from SmartHome.logic.deviceClass.DeviceClasses import DeviceClasses


def convert_list_types(types):
	arr = []
	for item in types:
		arr.append(item.__name__)
	return arr

class DeviceMeta(type):
	def __new__(cls, clsname, bases, dct, config = None, use=True):
		if config and not issubclass(config, ConfigSchema):
			raise InvalidAttributeException()
		if dct["Config"] and not issubclass(dct["Config"], ConfigSchema):
			raise SyntaxError("the Сonfig must be a class inheriting from the DefConfig class or must be equal to None.")
		if config and issubclass(config, ConfigSchema):
			dct["Config"] = config
		if not "Config" in dct:
			dct["Config"] = ConfigSchema
		if "types" in dct:
			dct["types"] = convert_list_types(dct["types"])
		new_class = super(DeviceMeta, cls).__new__(cls, clsname, bases, dct)
		if use:
			DeviceClasses.add(clsname, new_class)
		return new_class