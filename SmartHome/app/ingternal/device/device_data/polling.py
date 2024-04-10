import logging, asyncio
from app.ingternal.device.models.device import Device, Device_field, Value
from app.ingternal.device.exceptions.device import DeviceNotFound
from app.ingternal.device.device_class.BaseDeviceClass import BaseDevice
from SmartHome.app.ingternal.device.device_data.devices_arrey import DevicesArrey, DevicesArreyItem
from app.ingternal.device.device_class.DeviceClasses import DeviceClasses
from app.ingternal.device.enums import StatusDevice
from app.ingternal.device.map import device_db_to_schema
from app.ingternal.device.edit_field import edit_fields

from typing import List

logger = logging.getLogger(__name__)

async def polling(element: DevicesArreyItem):
	try:
		device:BaseDevice = element.device
		device.updata()
		data = device.get_data()
		data.device_status = StatusDevice.ONLINE
		return data
	except Exception as e:
		logger.warning(f'device not found. {e}')
		DevicesArrey.delete(element.id)

async def get_value_device(device: Device):
	fields: List[Device_field] = await Device_field.objects.all(device=device)
	fields_arr_data = []
	for field in fields:
		values: List[Value] = await Value.objects.all(field=field)
		_field = field.dict(exclude={"id", "device"})
		if (len(values) > 0):
			_field["value"] = values[-1].value
		else:
			_field["value"] = ""
		fields_arr_data.append(_field)
	return fields_arr_data

async def polling_and_init(device_data: Device):
	try:
		logger.debug("get_device function")
		device:BaseDevice
		if not device_data:
			raise DeviceNotFound()
		if device_data.device_polling == False:
			data = await device_db_to_schema(device_data)
			data.value = dict()
			data.device_status = StatusDevice.UNLINK
			return data
		element = DevicesArrey.get(device_data.system_name)
		if not element:
			device_full_data = {**device_data.dict(), "fields": await get_value_device(device_data)}
			device:BaseDevice = DeviceClasses.get_device(device_data.class_device, data=device_full_data)
			if not device:
				data = await device_db_to_schema(device_data)
				data.value = dict()
				data.device_status = StatusDevice.NOT_SUPPORTED
				return data
			await device.final_formation_device()
			if not device.is_conected:
				data = await device_db_to_schema(device_data)
				data.device_status = StatusDevice.OFFLINE
				data.value = dict()
				return data
			class_device = DeviceClasses.get(device_data.class_device)
			if class_device and class_device.Config.init_field:
				await edit_fields(device_data, [x._get_initial_data() for x in device.values], option=class_device.Config)
			DevicesArrey.addDevice(device_data.system_name, device)
		else:
			device = element.device
		if device.device_cyclic_polling:
			device.updata()
		device.updata_virtual_field()
		data = device.get_data()
		data.device_status = StatusDevice.ONLINE
		return data
	except Exception as e:
		logger.warning(f'device not found. {e}')
		element = DevicesArrey.get(device_data.system_name)
		if element:
			DevicesArrey.delete(device_data.system_name)
		data = await device_db_to_schema(device_data)
		data.device_status = StatusDevice.OFFLINE
		data.value = dict()
		return data
		
async def polling_all_and_init(devices_data: List[Device]):
	tasks = [polling_and_init(device) for device in devices_data]
	results = await asyncio.gather(*tasks)
	return results

async def device_polling_edit(system_name: str, poling: bool):
	device: Device | None = await Device.objects.get_or_none(system_name=system_name)
	if not device:
		raise DeviceNotFound()
	device.device_polling = poling
	await device.update(_columns=["device_polling"])