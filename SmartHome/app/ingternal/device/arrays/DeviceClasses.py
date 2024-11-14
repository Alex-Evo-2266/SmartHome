
import logging
from typing import Any, Dict

from app.ingternal.device.exceptions.device import ClassAlreadyExistsException, DeviceNotFound
from app.ingternal.device.interface.device_class import IDevice
from app.ingternal.device.schemas.device import DeviceSerializeSchema

logger = logging.getLogger(__name__)


class DeviceClasses(object):
	_classes:Dict[str, type[IDevice]] = dict()

	@classmethod
	def add(cls, class_name:str, new_class:type[IDevice])->None:
		if class_name in cls._classes:
			raise ClassAlreadyExistsException()
		logger.info("added device class",class_name)
		cls._classes[class_name] = new_class

	@classmethod
	def clear(cls)->None:
		cls._classes = dict()

	@classmethod
	def get(cls, class_name:str)->type[IDevice]|None:
		if not class_name in cls._classes:
			raise DeviceNotFound("Class not fount")
		if class_name in cls._classes:
			return cls._classes[class_name]
		return None

	@classmethod
	def all(cls):
		return cls._classes

	@classmethod
	def get_device(cls, class_name:str, data:DeviceSerializeSchema) -> IDevice:
		if not class_name in cls._classes:
			raise DeviceNotFound("Class not fount")
		deviceClass = cls._classes[class_name]
		device = deviceClass(**data)
		return device