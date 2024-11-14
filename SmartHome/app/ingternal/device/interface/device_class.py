from app.ingternal.device.schemas.device import DeviceSchema, DeviceSerializeSchema
from app.ingternal.device.schemas.config import ConfigSchema
from app.ingternal.device.interface.field_class import IField
from app.ingternal.device.schemas.enums import ReceivedDataFormat, DeviceGetData

class IDevice():

	device_config = ConfigSchema()

	async def async_init(self):
		'''
			вызывается после интциализации,
			если нужно подгружить при инициализации что то асинхронно
		'''
		pass

	def get_value(self, field_id: str)->str:
		pass

	def get_values(self)->dict[str, str]:
		pass

	def get_field(self, field_id: str)->IField | None:
		pass

	def get_fields(self)->list[IField]:
		pass

	def get_address(self)->str | None:
		pass

	def get_type_command(self)->ReceivedDataFormat:
		pass

	def get_type_get_data(self)->DeviceGetData:
		pass

	def get_device(self)->any:
		pass

	@property
	def is_conected(self):
		'''
		if the device does not require a connection, then always "true"
		'''
		return True

	def set_value(self, field_id: str, value: str):
		pass

	def save(self):
		pass


	def load(self):
		pass

	async def load_async(self):
		pass

	def dict(self):
		pass


	def get_data(self)->DeviceSerializeSchema:
		pass

	def get_schema(self)->DeviceSchema:
		pass