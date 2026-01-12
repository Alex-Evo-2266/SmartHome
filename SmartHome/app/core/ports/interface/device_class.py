from app.schemas.device.device import DeviceSchema, DeviceSerializeSchema, DeviceInitFieldSchema
from app.schemas.device.config import ConfigSchema
from app.core.ports.interface.field_class import IField
from app.schemas.device.enums import ReceivedDataFormat, DeviceGetData

class IDevice():

	device_config = ConfigSchema()
	data: DeviceSerializeSchema

	async def async_init(self):
		'''
			вызывается после интциализации,
			если нужно подгружить при инициализации что то асинхронно
		'''
		pass

	def get_value(self, field_id: str)->str:
		pass

	def __add_field(self, item:DeviceInitFieldSchema):
		pass

	def get_values(self)->dict[str, str]:
		pass

	def get_poll_config(self)->tuple[int, int]:
		pass

	def get_field(self, field_id: str)->IField | None:
		pass

	def get_field_by_name(self, field_name: str)->IField | None:
		pass

	def get_field_by_address(self, address: str)->IField | None:
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

	def get_class(self)->str:
		pass

	@property
	def is_conected(self):
		'''
		if the device does not require a connection, then always "true"
		'''
		return True

	async def set_value(self, field_id: str, value: str, *, script:bool = False, save_status: bool = False):
		pass

	async def save(self):
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

	def close(self):
		pass