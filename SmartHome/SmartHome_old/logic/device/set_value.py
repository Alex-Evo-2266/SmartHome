
import logging

from SmartHome.logic.device.devices_arrey import DevicesArrey
from SmartHome.logic.deviceClass.interfaces.device_value_interface import IValueDevice


logger = logging.getLogger(__name__)


async def set_value(system_name:str, field_name:str, value:str):
	'''
	set the value of the device field.
	'''
	try:
		deviceDect = DevicesArrey.get(system_name)
		if not deviceDect:
			raise Exception("device not connect")
		device:IValueDevice = deviceDect.device
		field = device.get_field(field_name)
		if not field:
			logger.debug(f'field not found. systemName:{system_name},field_name:{field_name},value:{value}')
			return None
		device.set_value(field_name,value)
		return True
	except Exception as ex:
		logger.error(f'error set value. systemName:{system_name}, detail:{ex}')
		return None