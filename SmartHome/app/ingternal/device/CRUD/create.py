from app.ingternal.device.schemas.device import AddDeviceSchema
from app.ingternal.device.CRUD.utils import duble_field
from app.ingternal.device.models.device import Device, Device_field

async def add_device(data: AddDeviceSchema):
	await duble_field(data.fields, data.system_name)
	new_device = await Device.objects.create(**(data.dict()))
	for field in data.fields:
		await Device_field.objects.create(**(field.dict()), device=new_device)