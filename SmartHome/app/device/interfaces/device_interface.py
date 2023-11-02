from app.device.interfaces.device_save_interface import ISaveDevice
from app.device.interfaces.device_value_interface import IValueDevice
from app.device.interfaces.device_get_info_interface import IGetDeviceData
from app.device.type_class.BaseType import BaseType
from app.device.device_class.schemas import ConfigSchema

class IDevice(ISaveDevice, IValueDevice, IGetDeviceData):

	types=[BaseType]

	class Config(ConfigSchema):
		pass
	
	@property
	def is_conected(self):
		'''
		if the device does not require a connection, then always "true"
		'''
		return True

	def updata(self):
		pass