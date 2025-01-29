from app.ingternal.device.classes.baseDevice import BaseDevice

class MQTTDevice(BaseDevice):
	
	def __init__(self, *args, **kwargs):
		super().__init__(**kwargs)
	
	def load(self):
		super().load()

	async def load_async(self):
		super().load_async()

	def set_value(self, field_id: str, value: str):
		super().set_value(field_id, value)
