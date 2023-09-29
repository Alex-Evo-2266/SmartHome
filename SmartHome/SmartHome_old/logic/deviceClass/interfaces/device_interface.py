from SmartHome.logic.deviceClass.interfaces.device_get_info_interface import IGetDeviceData
from SmartHome.logic.deviceClass.interfaces.device_value_interface import IValueDevice
from SmartHome.logic.deviceClass.interfaces.device_save_interface import ISaveDevice
from SmartHome.logic.deviceClass.typeDevice.BaseType import BaseType
from SmartHome.logic.deviceClass.DeviceMeta import ConfigSchema

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