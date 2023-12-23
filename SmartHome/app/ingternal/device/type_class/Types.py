
import logging
from optparse import Option
from typing import Any, Dict

from app.ingternal.device.exceptions.device import ClassAlreadyExistsException
from app.ingternal.device.schemas.type import TypeDevice

logger = logging.getLogger(__name__)


class DeviceTypeClasses(object):
	_classes:Dict[str, TypeDevice] = dict()

	@staticmethod
	def add(class_name:str, cls:TypeDevice)->None:
		if class_name in DeviceTypeClasses._classes:
			raise ClassAlreadyExistsException()
		logger.info("added type class",class_name)
		DeviceTypeClasses._classes[class_name] = cls

	@staticmethod
	def clear()->None:
		DeviceTypeClasses._classes = dict()

	@staticmethod
	def get(class_name:str)->TypeDevice|None:
		if class_name in DeviceTypeClasses._classes:
			return DeviceTypeClasses._classes[class_name]
		return None

	@staticmethod
	def all()->Dict[str, TypeDevice]:
		return DeviceTypeClasses._classes