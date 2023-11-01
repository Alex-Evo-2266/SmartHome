
from app.device.models import Device, Device_field
from typing import List
from app.device.schemas import AddDeviceFieldSchema
from app.exceptions.exceptions import DeviceNotFound
from app.device.get_dict_from_list import get_dict_from_list


async def edit_fields(device: Device, new_fields: List[AddDeviceFieldSchema]):
	editable_field = []
	if not device:
		raise DeviceNotFound()
	fields: List[Device_field] = await Device_field.objects.all(device=device)
	for field in fields:
		new_field = get_dict_from_list([x.dict() for x in new_fields], "name", field.name)
		if new_field:
			await field.update(**new_field)
			editable_field.append(field.name)
		else:
			await field.delete()
	for new_field_data in new_fields:
		if not new_field_data.name in editable_field:
			new_field = await Device_field.objects.create(**(new_field_data.dict()), device=device)