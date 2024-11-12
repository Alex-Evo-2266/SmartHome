from app.ingternal.device.schemas.device import DeviceSchema
from app.ingternal.device.interface.field_class import IField

class IDevice():

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

	def get_type_command(self)->any:
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

	def dict(self):
		pass

	def get_data(self)->DeviceSchema:
		pass