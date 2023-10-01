
import logging
from optparse import Option
from typing import Any, Dict

from app.exceptions.exceptions import ClassAlreadyExistsException

logger = logging.getLogger(__name__)


class DeviceTypeClasses(object):
	_classes:Dict[str, Any] = dict()

	@staticmethod
	def add(class_name:str, cls:Any)->None:
		if class_name in DeviceTypeClasses._classes:
			raise ClassAlreadyExistsException()
		logger.info("added type class",class_name)
		DeviceTypeClasses._classes[class_name] = cls

	@staticmethod
	def clear()->None:
		DeviceTypeClasses._classes = dict()

	@staticmethod
	def get(class_name:str)->Any|None:
		if class_name in DeviceTypeClasses._classes:
			return DeviceTypeClasses._classes[class_name]
		return None

	@staticmethod
	def all()->Dict[str, Any]:
		return DeviceTypeClasses._classes