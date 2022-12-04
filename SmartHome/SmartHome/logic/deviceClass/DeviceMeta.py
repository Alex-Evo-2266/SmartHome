from typing import List
from exceptions.exceptions import InvalidAttributeException
from SmartHome.logic.deviceClass.schema import AdditionDevice, ChangeDevice, ChangeField
from SmartHome.logic.deviceClass.DeviceClasses import DeviceClasses


class DefConfig():
	address:bool = True
	token:bool = False
	fields_addition:bool = True
	fields_change:ChangeField = ChangeField()
	added_url=None
	change_url=None

def convert_list_types(types):
	arr = []
	for item in types:
		arr.append(item.__name__)
	return arr

class DeviceMeta(type):
	def __new__(cls, clsname, bases, dct, config = None, use=True):
		if config and not issubclass(config, DefConfig):
			raise InvalidAttributeException()
		if dct["Config"] and not issubclass(dct["Config"], DefConfig):
			raise SyntaxError("the Сonfig must be a class inheriting from the DefConfig class or must be equal to None.")
		if config and issubclass(config, DefConfig):
			dct["Config"] = config
		if not "Config" in dct:
			dct["Config"] = DefConfig
		if "types" in dct:
			dct["types"] = convert_list_types(dct["types"])
		new_class = super(DeviceMeta, cls).__new__(cls, clsname, bases, dct)
		if use:
			DeviceClasses.add(clsname, new_class)
		return new_class