from app.ingternal.device.interface.field_class import IField
from app.ingternal.device.schemas.device import DeviceSerializeFieldSchema
from app.ingternal.device.schemas.add_device import AddDeviceFieldSchema
from app.ingternal.device.schemas.enums import TypeDeviceField
# from app.ingternal.modules.arrays.serviceDataPoll import DevicesDataArrey

class FieldBase(IField):
	def __init__(self, field: DeviceSerializeFieldSchema, device_system_name: str):
		self.data = field
		self.device_system_name = device_system_name

	def get(self):
		return self.data.value
	
	def get_id(self):
		return self.data.id
	
	def get_high(self):
		return self.data.high

	def get_low(self):
		return self.data.low

	def get_type(self):
		return self.data.type

	def get_unit(self)->str:
		return self.data.unit
	
	def get_entity(self) -> str:
		return self.data.entity
	
	def get_address(self) -> str:
		return self.data.address
	
	def is_virtual_field(self) -> bool:
		return self.data.virtual_field
	
	def is_read_only(self) -> bool:
		return self.data.read_only

	def get_name(self) -> str:
		return self.data.name
	
	def get_enum(self) -> list[str] | None:
		try:
			enums_data = self.data.enum_values
			if not enums_data:
				return None
			enums = enums_data.split(',')
			enums = [x.strip() for x in enums]
			return enums
		except ValueError:
			return None

	def _get_initial_data(self)->AddDeviceFieldSchema:
		return AddDeviceFieldSchema(
			name=self.data.name,
			address=self.data.address,
			type=self.data.type,
			low=self.data.low,
			high=self.data.high,
			enum_values=self.data.enum_values,
			read_only=self.data.read_only,
			entity=self.data.entity,
			icon=self.data.icon,
			unit=self.data.unit,
			virtual_field=self.data.virtual_field
		)

	def get_data(self)->DeviceSerializeFieldSchema:
		return self.data

	def dict(self):
		return self.data.model_dump()
	
	@staticmethod
	def getInt(data:str | None):
		try:
			if not data:
				return None
			return int(data)
		except ValueError:
			return None

	def set(self, status: str, script=True):
		if self.data.type == TypeDeviceField.BINARY:
			if self.data.high:
				if self.data.high == status:
					self.data.value = '1'
			elif self.data.low:
				if self.data.low == status:
					self.data.value == '0'
			elif status == '1':
				self.data.value = '1'
			elif status == '0':
				self.data.value == '0'
		elif self.data.type == TypeDeviceField.NUMBER:
			high = FieldBase.getInt(self.data.high)
			low = FieldBase.getInt(self.data.low)
			status_int = FieldBase.getInt(status)
			if not status_int:
				return
			if high:
				if high < status_int:
					self.data.value = str(high)
			elif low:
				if low > status_int:
					self.data.value == str(low)
			self.data.value = str(status_int)
		elif self.data.type == TypeDeviceField.ENUM:
			enums = self.get_enum()
			if not enums:
				return
			if status in enums:
				self.data.value = status
		else:
			self.data.value = status

		



		if not self.data.virtual_field:
			pass
		if script:
			pass

		# if not save_all:
		# 	data = DevicesDataArrey.get(self.device_system_name)
		# 	if data and self.data.name in data.device.value and data.device.value[self.data.name] == self.data.value:
		# 		return
		# DevicesDataArrey.
		

