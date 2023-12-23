from typing import List
from app.ingternal.exceptions.base import InvalidAttributeException
from app.ingternal.device.schemas.device_class import ConfigSchema
from app.ingternal.device.device_class.DeviceClasses import DeviceClasses
from app.ingternal.device.type_class.BaseType import BaseType
from app.ingternal.device.type_class.Types import DeviceTypeClasses

def convert_list_types(types:List[BaseType]):
	arr = []
	if len(types) == 0:
		all_types = DeviceTypeClasses.all()
		for key in all_types:
			type_item = all_types[key]
			if type_item:
				arr.append(type_item)
		return arr
	for item in types:
		type_item = DeviceTypeClasses.get(item.__name__)
		if type_item:
			arr.append(type_item)
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
		print(clsname, "types" in dct)
		if "types" in dct:
			dct["types"] = convert_list_types(dct["types"])
		else:
			dct["types"] = convert_list_types([])
		new_class = super(DeviceMeta, cls).__new__(cls, clsname, bases, dct)
		if use:
			DeviceClasses.add(clsname, new_class)
		return new_class