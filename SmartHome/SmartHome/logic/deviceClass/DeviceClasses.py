
from optparse import Option
from typing import Any, Dict

class ClassAlreadyExistsException(Exception):
	def __init__(self, *args: object) -> None:
		if args:
			self.message = args[0]
		else:
			self.message = "the class already exists"
	
	def __str__(self) -> str:
		if self.message:
			return f"ClassAlreadyExistsException, {self.message}"
		else:
			return "ClassAlreadyExistsException"


class DeviceClasses(object):
	_classes:Dict[str, Any] = dict()

	@staticmethod
	def add(class_name:str, cls:Any)->None:
		if class_name in DeviceClasses._classes:
			raise ClassAlreadyExistsException()
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
	def get_device(class_name:str, system_name)->Dict[str, Any]:
		return DeviceClasses._classes