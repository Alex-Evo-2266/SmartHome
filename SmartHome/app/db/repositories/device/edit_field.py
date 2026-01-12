
from app.db.models.device.device import Device, DeviceField
from typing import List, Dict
from app.schemas.device.add_device import AddDeviceFieldSchema
from app.exceptions.device import DeviceNotFound
from app.core.utils.get_dict_from_list import get_dict_from_list
from app.schemas.device.config import ConfigSchema
from app.db.repositories.device.utils.utils import get_id

async def update_field(field:DeviceField, new_field: Dict[str, str], option:None | ConfigSchema = None):
	if not option:
		return await field.update(**new_field)
	if not option.fields_change.address:
		field.address = new_field["address"]
		'''control -> read_only'''
	if not option.fields_change.control:
		field.read_only = new_field["read_only"]
	if not option.fields_change.enum_values:
		field.enum_values = new_field["enum_values"]
	if not option.fields_change.high:
		field.high = new_field["high"]
	if not option.fields_change.low:
		field.low = new_field["low"]
	if not option.fields_change.icon:
		field.icon = new_field["icon"]
	if not option.fields_change.name:
		field.name = new_field["name"]
	if not option.fields_change.type:
		field.type = new_field["type"]
	if not option.fields_change.unit:
		field.unit = new_field["unit"]
	if not option.fields_change.category:
		field.category = new_field["category"]
	if not option.fields_change.type_get_value:
		field.type_get_value = new_field["type_get_value"]
	if not option.fields_change.tag:
		field.tag = new_field["tag"]

	await field.update(_columns=["address", "read_only", "enum_values", "high", "low", "icon", "name", "type", "unit", "tag", "category", "type_get_value"])

async def edit_fields(device: Device, new_fields: List[AddDeviceFieldSchema], option:None | ConfigSchema = None):
	editable_field = []
	if not device:
		raise DeviceNotFound()
	fields: List[DeviceField] = await DeviceField.objects.all(device=device)
	for field in fields:
		new_field = get_dict_from_list([x.dict() for x in new_fields], "name", field.name)
		if new_field:

			await update_field(field, new_field, option)
			editable_field.append(field.name)

		else:
			await field.delete()
	for new_field_data in new_fields:

		if not new_field_data.name in editable_field:

			id = await get_id()
			new_field = await DeviceField.objects.create(**(new_field_data.dict()), device=device, id=id)
			