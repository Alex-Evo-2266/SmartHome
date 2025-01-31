from app.ingternal.device.classes.baseDevice import BaseDevice
from typing import Optional
from ..services.MqttService import MqttService
from ..settings import MQTT_SERVICE_PATH
from app.ingternal.modules.arrays.serviceDataPoll import servicesDataPoll
from app.ingternal.device.schemas.enums import ReceivedDataFormat
import json

class MQTTDevice(BaseDevice):
	
	def __init__(self, *args, **kwargs):
		super().__init__(*args, **kwargs)
	
	def load(self):
		super().load()

	async def load_async(self):
		super().load_async()

	def set_value(self, field_id: str, value: str):
		super().set_value(field_id, value)
		mqtt_service: Optional[MqttService] = servicesDataPoll.get(MQTT_SERVICE_PATH)

		if(self.data.type_command == ReceivedDataFormat.JSON):
			message = dict()
			field = self.get_field(field_id)
			message[f"{field.get_address()}/set"] = value
			mqtt_service.run_command(self.data.address, json.dumps(message))

		elif(self.data.type_command == ReceivedDataFormat.STRING):
			field = self.get_field(field_id)
			address = f"{self.data.address}/{field.get_address()}"
			mqtt_service.run_command(address, value)
