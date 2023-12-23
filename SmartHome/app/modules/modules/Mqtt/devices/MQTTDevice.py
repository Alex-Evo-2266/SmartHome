from typing import List
from app.ingternal.device.enums import TypeDeviceField, ReceivedDataFormat
from app.ingternal.device.device_class.BaseDeviceClass import BaseDevice
from app.ingternal.device.device_class.BaseField import BaseField
from app.ingternal.device.schemas.device_class import ConfigSchema

from app.modules.modules_src.services import Services
import json
from ..settings import SERVICE_MQTT

from app.ingternal.device.type_class.Types import DeviceTypeClasses

def look_for_param(arr:List[BaseField], val):
	for item in arr:
		if(item.name == val):
			return(item)
	return None

def look_for_by_topic(arr:list, val):
	for item in arr:
		if(item.address == val):
			return(item)
	return None

# def createValue()

class MqttDevice(BaseDevice):

	class Config(ConfigSchema):
		class_img = "Mqtt/mqtt-ver.png"
		change_polling = True

	def __init__(self, *args, **kwargs):
		super().__init__(**kwargs)
		self.update_value()

	def updata(self):
		self.update_value()

	def update_value(self, *args, **kwargs):
		if self.type_command==ReceivedDataFormat.JSON:
			data = dict()
			data[self.values[0].address] = ""
			data = json.dumps(data)
			service = Services.get(SERVICE_MQTT)
			service.publish(self.address+"/get", data)

	def get_device(self):
		return True

	@property
	def is_conected(self):
		'''
		if the device does not require a connection, then always "true"
		'''
		return True

	def set_value(self, name, status):
		super().set_value(name, status)
		message = ""
		val = look_for_param(self.values, name)
		if(val.type==TypeDeviceField.BINARY):
			message = status
			# if(int(status)==1):
			#     message = val.high
			# else:
			#     message = val.low
		elif(val.type==TypeDeviceField.NUMBER):
			if(int(status)>int(val.high)):
				message = int(val.high)
			elif(int(status)<int(val.low)):
				message = int(val.low)
			else:
				message = int(status)
		else:
			message = status
		if(self.get_type_command() == ReceivedDataFormat.JSON):
			data = dict()
			data[val.address] = message
			data = json.dumps(data)
			print(self.get_address()+"/set", data)
			Services.get(SERVICE_MQTT).publish(self.get_address()+"/set", data)
		else:
			alltopic = self.get_address() + "/" + val.address
			Services.get(SERVICE_MQTT).publish(alltopic, message)
