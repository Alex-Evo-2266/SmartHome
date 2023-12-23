from app.ingternal.device.models.device import Device, Device_field
from app.ingternal.device.schemas.device import DeviceSchema, FieldDeviceSchema
from typing import List

def device_field_db_to_schema(field: Device_field)->FieldDeviceSchema:
	return FieldDeviceSchema(
		name=field.name,
		address=field.address,
		type=field.type,
		low=field.low,
		high=field.high,
		enum_values=field.enum_values,
		read_only=field.read_only,
		icon=field.icon,
		unit=field.unit,
		virtual_field=field.virtual_field,
		value=None
	)

async def device_db_to_schema(device: Device)->DeviceSchema:
	fields: List[Device_field] = await Device_field.objects.all(device=device)
	return DeviceSchema(
		name=device.name,
		system_name=device.system_name,
		class_device=device.class_device,
		type=device.type,
		address=device.address,
		token=device.token,
		type_command=device.type_command,
		device_polling=device.device_polling,
		device_status=device.device_status,
		value=dict(),
		fields=[device_field_db_to_schema(x) for x in fields]
	)