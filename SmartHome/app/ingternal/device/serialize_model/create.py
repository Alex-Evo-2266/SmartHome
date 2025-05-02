from app.ingternal.device.schemas.add_device import AddDeviceSchema
from app.ingternal.device.serialize_model.utils import duble_field, create_field_id
from app.ingternal.device.models.device import Device, DeviceField
from app.ingternal.device.get_cached_device_data import invalidate_cache_device_data
import copy

async def add_device(data: AddDeviceSchema):
	await duble_field(data.fields, data.system_name)
	data2 = copy.copy(data)
	del data2.fields
	new_device = await Device.objects.create(**(data2.dict()))
	for field in data.fields:
		id = await create_field_id()
		await DeviceField.objects.create(**(field.dict()), device=new_device, id=id)

	invalidate_cache_device_data()