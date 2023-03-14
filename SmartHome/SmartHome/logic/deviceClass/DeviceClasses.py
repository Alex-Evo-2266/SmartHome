
import logging
from optparse import Option
from typing import Any, Dict
from SmartHome.logic.deviceFile.schema import DeviceSchema

from exceptions.exceptions import ClassAlreadyExistsException, DeviceNotFound

logger = logging.getLogger(__name__)


class DeviceClasses(object):
	_classes:Dict[str, Any] = dict()

	@staticmethod
	def add(class_name:str, cls:Any)->None:
		if class_name in DeviceClasses._classes:
			raise ClassAlreadyExistsException()
		logger.info("added device class",class_name)
		DeviceClasses._classes[class_name] = cls

	@staticmethod
	def clear()->None:
		DeviceClasses._classes = dict()

	@staticmethod
	def get(class_name:str)->Any|None:
		if class_name in DeviceClasses._classes:
			return DeviceClasses._classes[class_name]
		return None

	@staticmethod
	def all()->Dict[str, Any]:
		return DeviceClasses._classes

	@staticmethod
	def get_device(class_name:str, device_data:DeviceSchema):
		if not class_name in DeviceClasses._classes:
			raise DeviceNotFound("Class not fount")
		deviceClass = DeviceClasses._classes[class_name]
		device = deviceClass(device_data=device_data)
		return device