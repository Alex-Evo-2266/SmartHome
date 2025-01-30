from typing import Optional

from app.ingternal.device.schemas.edit_device import EditDeviceSchema
from app.ingternal.device.models.device import Device
from app.ingternal.device.serialize_model.edit_field import edit_fields
from app.ingternal.device.exceptions.device import DeviceNotFound
from app.ingternal.device.arrays.DevicesArray import DevicesArray
from app.ingternal.device.serialize_model.utils import duble_field
from app.ingternal.device.schemas.enums import DeviceStatusField



async def edit_device(system_name: str, data: EditDeviceSchema):
	"""Редактирование устройства."""
	device: Optional[Device] = await Device.objects.get_or_none(system_name=system_name)

	if not device:
		raise DeviceNotFound()
	
	await duble_field(data.fields, data.system_name)
	await edit_fields(device, data.fields)

	# Обновление устройства
	device.update_from_dict(data.dict())
	await device.save()
	
	 # Удаление из кэша
	DevicesArray.delete(system_name)


async def edit_status_device(system_name: str, status: bool):
    """Редактирование статуса устройства."""
    device: Optional[Device] = await Device.objects.get_or_none(system_name=system_name)
    
    if not device:
        raise DeviceNotFound()

    device.status = DeviceStatusField.LINK if status else DeviceStatusField.UNLINK
    
    await device.update(_columns=["status"])
    
    DevicesArray.delete(system_name)