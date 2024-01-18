
import logging

from app.ingternal.device.devices_arrey import DevicesArrey
from app.ingternal.device.interfaces.device_value_interface import IValueDevice
from app.ingternal.device.communication_fields.communications import CommunicationFields
from app.ingternal.device.schemas.communication_fields import TypeRelatedFields
from app.ingternal.device.schemas.field import TypeDeviceField


logger = logging.getLogger(__name__)


def set_value(system_name:str, field_name:str, value:str, communication_fields_send:bool = True):
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
		# if field.is_virtual_field() and field.is_read_only() and field.:
		# 	device.set_virtual_value(field_name,value)
		# else:
		device.set_value(field_name,value)
		if communication_fields_send:
			list_communication_fields = CommunicationFields.get_related_fields_device(system_name, field_name)
			if list_communication_fields:
				for communication_field in list_communication_fields:
					if communication_field.type == TypeRelatedFields.DEVICE:
						if field.get_type() == TypeDeviceField.BINARY and field.get() == field.get_high():
							set_value(communication_field.system_name, communication_field.field, "on")
						elif field.get_type() == TypeDeviceField.BINARY and field.get() == field.get_low():
							set_value(communication_field.system_name, communication_field.field, "off")
						else:
							set_value(communication_field.system_name, communication_field.field, value)
		return True
	except Exception as ex:
		logger.error(f'error set value. systemName:{system_name}, detail:{ex}')
		return None