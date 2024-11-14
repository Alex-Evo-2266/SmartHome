import logging, asyncio
from app.configuration.settings import FREQUENCY, LOOP_DEVICE_POLLING
from app.configuration.loop.loop import loop
from app.pkg import __config__
from app.ingternal.device.arrays.DeviceDataArray import DevicesDataArrey
from app.ingternal.device.arrays.DevicesArrey import DevicesArrey
from app.ingternal.device.arrays.DeviceClasses import DeviceClasses
from app.ingternal.device.schemas.enums import StatusDevice, DeviceGetData
from app.ingternal.device.schemas.device import DeviceSerializeSchema
from app.ingternal.device.interface.device_class import IDevice
from app.ingternal.device.serialize_model.utils import get_default_data
from app.ingternal.device.serialize_model.edit_field import edit_fields
from app.ingternal.device.serialize_model.read import get_all_device

logger = logging.getLogger(__name__)

class LoadingDevice():

	loading:set[str] = set()

	@classmethod
	def add(cls, data:str):
		cls.loading.add(data)

	@classmethod
	def has(cls, data:str):
		return data in cls.loading
	
	@classmethod
	def remove(cls, data):
		if cls.has(data):
			cls.loading.remove(data)

async def init_device(device_data: DeviceSerializeSchema):
	device_class = DeviceClasses.get(device_data.class_device)
	if not device_class:
		return StatusDevice.NOT_SUPPORTED
	device = device_class(device_data)
	await device.async_init()
	if not device.is_conected:
		return StatusDevice.OFFLINE
	if device_class.device_config.init_field:
		await edit_fields(device_data, [x._get_initial_data() for x in device.get_fields()], option=device_class.device_config)
	DevicesArrey.add_device(device_data.system_name, device)
	return device

async def polling(device_data: DeviceSerializeSchema):
	try:
		logger.debug("polling function")
		if LoadingDevice.has(device_data.system_name):
			return
		LoadingDevice.add(device_data.system_name)
		connection_device: IDevice
		if device_data.status == StatusDevice.UNLINK:
			DevicesDataArrey.add_or_updata(get_default_data(device_data, StatusDevice.UNLINK))
			LoadingDevice.remove(device_data.system_name)
			return 

		connection_device_item = DevicesArrey.get(device_data.system_name)
		if not connection_device_item:
			device = await init_device(device_data)
			if device == StatusDevice.NOT_SUPPORTED or device == StatusDevice.OFFLINE:
				DevicesDataArrey.add_or_updata(get_default_data(device_data, device))
				LoadingDevice.remove(device_data.system_name)
				return

			connection_device = device
		else:
			connection_device = connection_device_item.device
		if connection_device.get_type_get_data() == DeviceGetData.PULL:
			connection_device.load()
			await connection_device.load_async()
		data = connection_device.get_schema()
		data.status = StatusDevice.ONLINE
		DevicesDataArrey.add_or_updata(data)
		LoadingDevice.remove(device_data.system_name)
		
	except Exception as e:
		logger.warning(f'device not found. {e}')
		element = DevicesArrey.get(device_data.system_name)
		LoadingDevice.remove(device_data.system_name)
		if element:
			DevicesArrey.delete(device_data.system_name)
		DevicesDataArrey.add_or_updata(get_default_data(device_data, StatusDevice.OFFLINE))

async def polling_all():
	logger.info('polling_all function start')
	devices_data = await get_all_device()
	logger.info('polling start')
	tasks = [polling(device) for device in devices_data]
	await asyncio.gather(*tasks)
	logger.info('polling end')
	print('polling')

async def restart_polling():
	logger.info('restart_polling')
	frequency = __config__.get(FREQUENCY)
	if frequency and frequency.value:
		loop.register(LOOP_DEVICE_POLLING, polling_all, int(frequency.value))
	else:
		loop.register(LOOP_DEVICE_POLLING, polling_all, 6)