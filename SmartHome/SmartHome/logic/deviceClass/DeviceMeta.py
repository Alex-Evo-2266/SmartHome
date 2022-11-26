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

class DeviceMeta(type):
	def __new__(cls, clsname, bases, dct, config = None):
		if config and not issubclass(config, DefConfig):
			raise InvalidAttributeException()
		if dct["Config"] and not issubclass(dct["Config"], DefConfig):
			raise SyntaxError("the Сonfig must be a class inheriting from the DefConfig class or must be equal to None.")
		print(config, dct)
		if config and issubclass(config, DefConfig):
			dct["Config"] = config
		print(config, dct)
		if not "Config" in dct:
			dct["Config"] = DefConfig
		new_class = super(DeviceMeta, cls).__new__(cls, clsname, bases, dct)
		DeviceClasses.add(clsname, new_class)
		return new_class