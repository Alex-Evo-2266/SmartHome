

from SmartHome.logic.deviceClass.typeDevice.TypeMeta import DeviceTypeMeta


class BaseType(metaclass=DeviceTypeMeta, use=False):
	
	def __str__(self):
		return self.__class__