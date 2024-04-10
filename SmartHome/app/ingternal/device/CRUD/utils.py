from typing import List, Optional
from app.ingternal.device.schemas.device import AddDeviceFieldSchema
from app.ingternal.device.exceptions.device import DuplicateFieldsException

async def duble_field(fields: List[AddDeviceFieldSchema], system_name: Optional[str] = None):
	field_names = []
	for field in fields:
		if field.name in field_names:
			if not system_name:
				raise DuplicateFieldsException()
			raise DuplicateFieldsException(f"duplicate fields in {system_name}")
		field_names.append(field.name)