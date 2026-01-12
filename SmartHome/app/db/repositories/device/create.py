from app.schemas.device.add_device import AddDeviceSchema
from app.db.repositories.device.utils.utils import duble_field, get_id
from app.db.models.device.device import Device, DeviceField
from app.db.cache.device.invalidate_cache import invalidate_cache
from app.db.cache.room.all_rooms import invalidate_cache_room__type_device_data
from app.pkg.runtime.queue import __queue__
from app.core.entities.device.device_queue.types import InitDeviceItem

import copy

from app.pkg.logger import get_device_crud

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
		id = await get_id()
		await DeviceField.objects.create(**(field.dict()), device=new_device, id=id)

	__queue__.add("init_device", system_name=data.system_name, try_count=0)
	invalidate_cache()
	invalidate_cache_room__type_device_data()