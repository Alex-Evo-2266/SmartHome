import ormar, datetime
from ormar import ReferentialAction
from app.pkg.ormar.dbormar import base_ormar_config
from typing import Optional, List, Dict, Union, ForwardRef
from app.ingternal.device.schemas.enums import TypeDeviceField

class TypeDevice(ormar.Model):
	ormar_config = base_ormar_config.copy()

	id: str = ormar.String(max_length=100, primary_key=True)
	name_type: str = ormar.String(max_length=100)
	device: str = ormar.String(max_length=100)
	main: bool = ormar.Boolean(default=True)

class FieldTypeDevice(ormar.Model):
	ormar_config = base_ormar_config.copy()

	id: str = ormar.String(max_length=100, primary_key=True)
	device_type: Optional[Union[TypeDevice, Dict]] = ormar.ForeignKey(TypeDevice, related_name="fields", ondelete=ReferentialAction.CASCADE)
	name_field_type: str = ormar.String(max_length=100)
	id_field_device: str = ormar.String(max_length=100)
	description: str = ormar.String(max_length=300)
	required: bool = ormar.Boolean()
	field_type: TypeDeviceField = ormar.String(max_length=200, default=TypeDeviceField.NUMBER)
