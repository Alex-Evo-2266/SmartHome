
from typing import List, Optional
from uuid import uuid4
from app.schemas.device.add_device import AddDeviceFieldSchema
from app.schemas.device.device import DeviceSchema, DeviceSerializeSchema
from app.schemas.device.enums import DeviceStatusField, StatusDevice
from app.exceptions.device import DuplicateFieldsException

def get_id():
    return str(uuid4().hex)

async def duble_field(fields: List[AddDeviceFieldSchema], system_name: Optional[str] = None):
	field_names = []
	for field in fields:
		if field.name in field_names:
			if not system_name:
				raise DuplicateFieldsException()
			raise DuplicateFieldsException(f"duplicate fields in {system_name}")
		field_names.append(field.name)

def map_status(status:DeviceStatusField)->StatusDevice:
	if(status == DeviceStatusField.UNLINK):
		return StatusDevice.UNLINK
	return StatusDevice.ONLINE

def get_default_data(device: DeviceSerializeSchema, status: StatusDevice = StatusDevice.ONLINE):
	data = DeviceSchema(**(device.model_dump()))
	# data.value = dict()
	data.status = status
	return data