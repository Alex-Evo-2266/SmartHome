from app.ingternal.device.schemas.add_device import AddDeviceSchema
from app.ingternal.device.serialize_model.utils import duble_field, create_field_id
from app.ingternal.device.models.device import Device, DeviceField
from app.ingternal.device.cache.invalidate_cache import invalidate_cache
import copy

from app.ingternal.logs import get_device_crud

logger = get_device_crud.get_logger(__name__)

async def add_device(data: AddDeviceSchema):
	await duble_field(data.fields, data.system_name)
	data2 = copy.copy(data)
	del data2.fields
	logger.info("p1")
	new_device = await Device.objects.create(**(data2.dict()))
	logger.info(new_device)
	for field in data.fields:
		logger.info("p3")
		id = await create_field_id()
		await DeviceField.objects.create(**(field.dict()), device=new_device, id=id)

	invalidate_cache()