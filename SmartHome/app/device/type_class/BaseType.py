

from app.device.type_class.TypeMeta import DeviceTypeMeta


class BaseType(metaclass=DeviceTypeMeta, use=False):
	
	def __str__(self):
		return self.__class__