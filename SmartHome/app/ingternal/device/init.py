from app.ingternal.logs import get_polling_logger
from app.ingternal.device.serialize_model.read import get_serialize_device, get_all_row_device
from app.ingternal.device.serialize_model.update import edit_status_device
from app.ingternal.device.arrays.DeviceClasses import DeviceClasses
from app.ingternal.device.arrays.DevicesArray import DevicesArray
from app.ingternal.device.schemas.enums import StatusDevice
from app.ingternal.modules.struct.DeviceStatusStore import store
from app.configuration.queue import __queue__
from app.ingternal.device.device_queue.types import InitDeviceItem
import asyncio
from app.ingternal.device.exceptions.device import DeviceClassNotFound

MAX_TRY_COUNT = 10

logger = get_polling_logger.get_logger(__name__)

async def reinit(system_name: str, try_count: int):
	if(try_count < MAX_TRY_COUNT):
		__queue__.add("init_device", system_name=system_name, try_count=try_count + 1)
	else:
		await edit_status_device(system_name, False)


async def init(system_name: str, try_count: int):
	device = await get_serialize_device(system_name)
	await store.register_device_async(device.system_name, device)
	await store.apply_patch_async(device.system_name, {"__status__": StatusDevice.UNLINK})
	if device.status == StatusDevice.UNLINK:
		logger.error(f"Device {device.system_name} unlink.")  # Логирование отключенного устройства
		await store.apply_patch_async(device.system_name, {"__status__": StatusDevice.UNLINK})
		return
	try:
		logger.debug(f"search class: {device.system_name} {DeviceClasses.all()}")
		device_class = DeviceClasses.get(device.class_device)
		logger.debug(f"class device: {device.system_name} = {device_class}")
		if not device_class:
			logger.error(f"Device class {device.class_device} not supported.")  # Логирование неподдерживаемого класса устройства
			await store.apply_patch_async(device.system_name, {"__status__": StatusDevice.UNKNOWN})
			return
	except DeviceClassNotFound as e:
		logger.error(f"Device class {device.class_device} not supported.")  # Логирование неподдерживаемого класса устройства
		await store.apply_patch_async(device.system_name, {"__status__": StatusDevice.UNKNOWN})
		return
	try:
		logger.debug(f"create connect: {device.system_name}")
		connect = device_class(device)
		await connect.async_init()
		# initial_state = connect.get_values()
		initial_state = {}
		fields = connect.get_fields()
		for f in fields:
			initial_state[f.get_name()] = f.get()
		if initial_state:
			await store.apply_patch_async(device.system_name, initial_state)
		if not connect.is_conected:
			logger.warning(f"Device {device.system_name} is offline.")  # Логирование оффлайн устройства
			await store.apply_patch_async(device.system_name, {"__status__": StatusDevice.OFFLINE})
			await asyncio.sleep(2)
			logger.warning(f"Device {device.system_name} init try_count={try_count}.")  # Логирование оффлайн устройства
			await reinit(system_name, try_count)
			return
	
		await store.apply_patch_async(
			device.system_name,
			{"__status__": StatusDevice.ONLINE}
		)

		await connect.save()

		DevicesArray.add_device(device.system_name, connect)
	except Exception as e:
		await store.apply_patch_async(device.system_name, {"__status__": StatusDevice.OFFLINE})
		await asyncio.sleep(2)
		logger.warning(f"Device {device.system_name} init try_count={try_count}.")  # Логирование оффлайн устройства
		await reinit(system_name, try_count)

		
async def init_all():
	devices = await get_all_row_device(fields_include=False)
	logger.debug(f"devices: {[d.system_name for d in devices]}")
	await asyncio.gather(
		*(init(d.system_name, 0) for d in devices)
	)
	