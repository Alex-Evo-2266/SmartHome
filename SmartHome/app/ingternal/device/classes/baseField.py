import asyncio
from typing import Optional

from app.ingternal.device.interface.field_class import IField
from app.ingternal.device.schemas.device import DeviceSerializeFieldSchema, DeviceSchema
from app.ingternal.device.schemas.add_device import AddDeviceFieldSchema
from app.ingternal.device.schemas.enums import TypeDeviceField
from app.ingternal.automation.run.register import automation_manager
from app.ingternal.modules.arrays.serviceDataPoll import servicesDataPoll, ObservableDict
from app.ingternal.logs import get_device_base_class
from app.ingternal.device.map_value_field import normalize_value
from app.ingternal.room.array.RoomArray import RoomArray

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

	def get_data(self) -> DeviceSerializeFieldSchema:
		return self.data

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
		match self.data.type:
			case TypeDeviceField.BINARY:
				self._set_binary(status)
			case TypeDeviceField.NUMBER:
				self._set_number(status)
			case TypeDeviceField.ENUM:
				self._set_enum(status)
			case _:
				self.data.value = status

		# self._update_device_data()

		RoomArray.update_room(
			self.device_system_name, 
			self.get_id(), 
			normalize_value(self.get(), self.get_type(), self.get_low(), self.get_high())
		)

		# if script:
		# 	self._trigger_automation()

	def _set_binary(self, status: str):
		if self.data.high is not None and str(self.data.high) == status:
			self.data.value = '1'
		elif self.data.low is not None and str(self.data.low) == status:
			self.data.value = '0'
		elif self.data.high is None and self.data.low is None:
			if status in ('1', '0'):
				self.data.value = status
		else:
			logger.warning(f"Invalid binary value '{status}' for field '{self.get_name()}'")

	def _set_number(self, status: str):
		high = self.getInt(self.data.high)
		low = self.getInt(self.data.low)
		status_int = self.getFloat(status)

		if status_int is None:
			logger.warning(f"Invalid number value '{status}' for field '{self.get_name()}'")
			return

		if high is not None and status_int > high:
			self.data.value = str(high)
		elif low is not None and status_int < low:
			self.data.value = str(low)
		else:
			self.data.value = str(status_int)

	def _set_enum(self, status: str):
		enums = self.get_enum()
		if enums is None:
			logger.warning(f"Enum field '{self.get_name()}' has no enum values defined")
			return
		if status in enums:
			self.data.value = status
		else:
			logger.warning(f"Invalid enum value '{status}' for field '{self.get_name()}'")

	# def _update_device_data(self):
	# 	dev_list: Optional[ObservableDict] = servicesDataPoll.get(DEVICE_DATA_POLL)
	# 	if dev_list:
	# 		device: DeviceSchema | None = dev_list.get(self.device_system_name)
	# 		if device:
	# 			device.value[self.data.name] = self.data.value
	# 			logger.debug(f"Updated device '{self.device_system_name}' field '{self.data.name}' with value '{self.data.value}'")

	# def _trigger_automation(self):
	# 	try:
	# 		asyncloop = asyncio.get_running_loop()
	# 		asyncloop.create_task(
	# 			automation_manager.run_device_triggered_automations(self.device_system_name, self.get_name())
	# 		)
	# 		asyncloop.create_task(
	# 			automation_manager.run_room_triggered_automations(self.device_system_name, self.get_id(), self.room)
	# 		)
			
	# 		logger.debug(f"Scheduled automation for device '{self.device_system_name}' field '{self.get_name()}'")
	# 	except RuntimeError as e:
	# 		logger.warning(f"Could not schedule automation: {e}")
