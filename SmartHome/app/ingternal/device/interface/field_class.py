from app.ingternal.device.schemas.add_device import AddDeviceFieldSchema
from app.ingternal.device.schemas.device import DeviceSerializeFieldSchema
from app.ingternal.device.schemas.enums import TypeDeviceField

class IField():
	def get(self)->str | None:
		pass

	def get_full_value(self)->str | None:
		pass
	
	def get_high(self)-> str | None:
		pass

	def get_low(self) -> str | None:
		pass

	def get_type(self)->TypeDeviceField:
		pass

	def get_id(self)->str:
		pass

	def get_unit(self)->str:
		pass
	
	def get_entity(self) -> str:
		pass
	
	def get_address(self) -> str:
		pass
	
	def get_enum(self) -> list[str] | None:
		pass
	
	def is_virtual_field(self) -> bool:
		pass
	
	def is_read_only(self) -> bool:
		pass

	def get_name(self) -> str:
		pass

	def _get_initial_data(self)->AddDeviceFieldSchema:
		pass

	def get_data(self)->DeviceSerializeFieldSchema:
		pass

	def dict(self):
		pass

	def set(self, status, script=True):
		pass