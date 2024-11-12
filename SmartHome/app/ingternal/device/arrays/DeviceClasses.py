
import logging
from typing import Any, Dict

from app.ingternal.device.exceptions.device import ClassAlreadyExistsException, DeviceNotFound

logger = logging.getLogger(__name__)


class DeviceClasses(object):
	_classes:Dict[str, Any] = dict()

	@classmethod
	def add(cls, class_name:str, new_class:Any)->None:
		if class_name in cls._classes:
			raise ClassAlreadyExistsException()
		logger.info("added device class",class_name)
		cls._classes[class_name] = new_class

	@classmethod
	def clear(cls)->None:
		cls._classes = dict()

	@classmethod
	def get(cls, class_name:str)->Any|None:
		if not class_name in cls._classes:
			raise DeviceNotFound("Class not fount")
		if class_name in cls._classes:
			return cls._classes[class_name]
		return None

	@classmethod
	def all(cls)->Dict[str, Any]:
		return cls._classes

	@classmethod
	def get_device(cls, class_name:str, data:Dict[str, Any]):
		if not class_name in cls._classes:
			raise DeviceNotFound("Class not fount")
		deviceClass = cls._classes[class_name]
		device = deviceClass(**data)
		return device