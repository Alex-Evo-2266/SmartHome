from typing import List, Optional
from uuid import uuid4
from app.ingternal.device.schemas.add_device import AddDeviceFieldSchema
from app.ingternal.device.schemas.device import DeviceSchema, DeviceSerializeSchema
from app.ingternal.device.schemas.enums import DeviceStatusField, StatusDevice
from app.ingternal.device.exceptions.device import DuplicateFieldsException
from app.ingternal.device.models.device import DeviceField, Value

async def duble_field(fields: List[AddDeviceFieldSchema], system_name: Optional[str] = None):
	field_names = []
	for field in fields:
		if field.name in field_names:
			if not system_name:
				raise DuplicateFieldsException()
			raise DuplicateFieldsException(f"duplicate fields in {system_name}")
		field_names.append(field.name)

def find_id(fields:list[DeviceField], uuid:str):
	for field in fields:
		if field.id == uuid:
			return field
	return None

async def create_field_id():
	# fields = await DeviceField.objects.all()
	# uuid = uuid4().hex
	# while (find_id(fields, uuid)):
	# 	uuid = uuid4().hex
	# return uuid
	return str(uuid4().hex)

async def create_value_id():
	# values = await Value.objects.all()
	# uuid = uuid4().hex
	# while (find_id(values, uuid)):
	# 	uuid = uuid4().hex
	# return uuid
	return str(uuid4().hex)

def map_status(status:DeviceStatusField)->StatusDevice:
	if(status == DeviceStatusField.UNLINK):
		return StatusDevice.UNLINK
	return StatusDevice.ONLINE

def get_default_data(device: DeviceSerializeSchema, status: StatusDevice = StatusDevice.ONLINE):
	data = DeviceSchema(**(device.model_dump()))
	data.value = dict()
	data.status = status
	return data