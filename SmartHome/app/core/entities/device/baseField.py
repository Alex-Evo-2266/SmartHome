import asyncio
from typing import Optional

from app.core.ports.interface.field_class import IField
from app.schemas.device.device import DeviceSerializeFieldSchema, DeviceSchema, DeviceSerializeFieldWithActionsSchema
from app.schemas.device.add_device import AddDeviceFieldSchema
from app.schemas.device.enums import TypeDeviceField
from app.pkg.logger import get_device_base_class
# from app.ingternal.device.map_value_field import normalize_value

logger = get_device_base_class.get_logger(__name__)

class FieldBase(IField):
	def __init__(self, field: DeviceSerializeFieldSchema, device_system_name: str, room: str):
		self.data = field
		self.device_system_name = device_system_name
		self.room = room

	def get(self):
		return self.data.value
	
	def get_full_value(self):
		if(self.data.value == '1'):
			if(self.data.high is not None):
				return self.data.high
			else:
				return "1"
		elif(self.data.value == '0'):
			if(self.data.low is not None):
				return self.data.low
			else:
				return '0'
		else:
			logger.error("invalid value data")
			return self.get()

	def get_id(self):
		return self.data.id

	def get_high(self):
		return self.data.high

	def get_low(self):
		return self.data.low

	def get_type(self):
		return self.data.type

	def get_unit(self) -> str:
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
			if not isinstance(enums_data, str) or not enums_data:
				return None
			return [x.strip() for x in enums_data.split(',')]
		except Exception as e:
			logger.warning(f"Error parsing enum values for field {self.data.name}: {e}")
			return None

	def _get_initial_data(self) -> AddDeviceFieldSchema:
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

	def get_data(self) -> DeviceSerializeFieldWithActionsSchema:
		return DeviceSerializeFieldWithActionsSchema(**(self.dict()), actions=self.get_actions())

	def dict(self):
		return self.data.model_dump()

	@staticmethod
	def getInt(data: str | None) -> int | None:
		try:
			if data is None:
				return None
			return int(data)
		except ValueError:
			logger.warning(f"Unable to convert value to int: {data}")
			return None
		
	@staticmethod
	def getFloat(data: str | None) -> float | int | None:
		try:
			if data is None:
				return None
			value = float(data)
			# если нет дробной части — вернуть int
			if value.is_integer():
				return int(value)
			return value
		except ValueError:
			logger.warning(f"Unable to convert value to float: {data}")
			return None

	def set(self, status: str, script: bool = True):
		logger.info(f"Setting value '{status}' for field '{self.get_name()}' of device '{self.device_system_name}'")
		self.data.value = status

	def execute_action(
		self,
		action: str,
		value: str | None = None
	): 
		if value is None:
			raise ValueError("value required")
			
		match action:
			case "set":
				self.set(value)

			case _:
				raise ValueError(action)

	def get_actions(self) -> list[str]:
		return ["set"]