from app.core.ports.interface.device_class import IDevice
from app.core.ports.interface.field_class import IField
from app.schemas.device.device import DeviceSerializeSchema, DeviceSchema, DeviceSerializeFieldSchema, DeviceInitFieldSchema
from app.schemas.device.config import ConfigSchema
from app.schemas.device.enums import ReceivedDataFormat, DeviceGetData
from app.core.entities.device.baseField import FieldBase
from app.core.entities.device.metaDevice import DeviceMeta
from app.db.repositories.device.update import edit_fields, update_device_from_object
from app.core.state.get_store import get_container
from app.schemas.device.types_names import TypesDeviceEnum

from typing import ClassVar, Set, Union

class BaseDevice(IDevice, metaclass=DeviceMeta, use=False):
	poll_interval: int = 1
	device_config = ConfigSchema()
	# Статическое поле с допустимыми типами устройств
	ALLOWED_TYPES: ClassVar[Union[None, Set[TypesDeviceEnum]]] = None
	
	def __init__(self, device: DeviceSerializeSchema):
		self.data:DeviceSerializeSchema = device
		self.fields: list[FieldBase] = []
		if device.fields:
			for item in device.fields:
				self.fields.append(FieldBase(item, device.system_name, self.data.room))
		self.device = None

	def _add_field(self, item:DeviceInitFieldSchema):
		self.fields.append(FieldBase(DeviceSerializeFieldSchema(**(item.dict()), id=""), self.data.system_name, self.data.room))
	
	def get_value(self, field_id: str)->str | None:
		field = self.get_field(field_id)
		if not field:
			return
		return field.get()

	def get_values(self)->dict[str, str]:
		values:dict[str, str] = {}
		for field in self.fields:
			value = field.get()
			values[field.get_id()] = value
		return values

	def get_field(self, field_id: str)->IField | None:
		for field in self.fields:
			if field.get_data().id == field_id:
				return field
		return None
	
	def get_field_by_name(self, field_name: str)->IField | None:
		for field in self.fields:
			if field.get_data().name == field_name:
				return field
		return None
	
	def get_field_by_address(self, address: str)->IField | None:
		for field in self.fields:
			if field.get_data().address == address:
				return field
		return None

	def get_fields(self)->list[IField]:
		return self.fields

	def get_address(self)->str | None:
		return self.data.address

	def get_type_command(self)->ReceivedDataFormat:
		return self.data.type_command
	
	def get_type_get_data(self)->DeviceGetData:
		return self.data.type_get_data
	
	def get_poll_config(self)->tuple[int, int]:
		return (self.data.poll_interval, self.data.poll_timeout)

	def get_device(self)->any:
		return self.device
	
	def get_class(self)->any:
		return self.data.class_device

	@property
	def is_conected(self):
		'''
		if the device does not require a connection, then always "true"
		'''
		return True

	async def set_value(self, field_id: str, value: str, *, script:bool = False, save_status: bool = False):
		field = self.get_field(field_id)
		if not field:
			return
		if save_status:
			field.set(value, script)
			await get_container().device_store.apply_patch_async(self.data.system_name, {field.get_name(): value})
		if script:
			pass

	async def save(self):
		initial_fields = [field._get_initial_data() for field in self.fields]
		await edit_fields(self.data.system_name, initial_fields, init_device=False)
		await update_device_from_object(
			self.data.system_name,
			self.data.status,
			self.data.type_command,
			self.data.type_get_data,
			self.data.token,
			self.data.address,
			init_device=False
			)

	# def load(self):
	# 	pass

	# async def load_async(self):
	# 	await asyncio.to_thread(self.load)

	async def async_load(self) -> dict[str, str]:
		"""
		Возвращает ТОЛЬКО изменения:
		{ field_name: value }
		"""
		return {}

	def dict(self):
		data = self.get_schema()
		dict_data = dict(data)
		return dict_data


	def get_data(self)->DeviceSerializeSchema:
		fields:list[DeviceSerializeFieldSchema] = []
		for item in self.fields:
			fields.append(item.get_data())
		self.data.fields = fields
		return self.data

	def get_schema(self)->DeviceSchema:
		res = DeviceSchema(**(self.data.model_dump()))
		values:list[DeviceSerializeFieldSchema] = []
		vals: dict[str, str] = dict()
		for item in self.fields:
			values.append(item.get_data())
			vals[item.get_name()] = item.get()
		res.fields = values
		res.value = vals
		return res
	
	def close(self):
		pass