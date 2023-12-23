from app.ingternal.device.interfaces.device_save_interface import ISaveDevice
from app.ingternal.device.interfaces.device_value_interface import IValueDevice
from app.ingternal.device.interfaces.device_get_info_interface import IGetDeviceData
from app.ingternal.device.type_class.BaseType import BaseType
from app.ingternal.device.schemas.device_class import ConfigSchema
from app.ingternal.device.enums import ReceivedDataFormat

class IDevice(ISaveDevice, IValueDevice, IGetDeviceData):

	types=[BaseType]

	class Config(ConfigSchema):
		pass

	async def final_formation_device() -> None:
		pass

	def get_type_command(self) -> ReceivedDataFormat:
		pass
	
	def get_address(self) -> str:
		pass

	@property
	def is_conected(self):
		'''
		if the device does not require a connection, then always "true"
		'''
		return True

	def updata(self):
		pass
	