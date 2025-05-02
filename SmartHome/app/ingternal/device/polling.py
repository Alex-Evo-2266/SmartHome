import logging, asyncio
from app.configuration.settings import FREQUENCY, LOOP_DEVICE_POLLING
from app.configuration.loop.loop import loop
from app.pkg import __config__
from app.ingternal.device.saveDataInPoll import update_device_in_poll
from app.ingternal.device.arrays.DevicesArray import DevicesArray
from app.ingternal.device.arrays.DeviceClasses import DeviceClasses
from app.ingternal.device.schemas.enums import StatusDevice, DeviceGetData
from app.ingternal.device.schemas.device import DeviceSerializeSchema
from app.ingternal.device.interface.device_class import IDevice
from app.ingternal.device.serialize_model.utils import get_default_data
from app.ingternal.device.serialize_model.update import edit_fields
from app.ingternal.device.serialize_model.read import get_serialize_device
from app.ingternal.device.get_cached_device_data import get_cached_device_data

# Настройка логирования / Logging setup
from app.ingternal.logs import get_polling_logger

# Настройка логгера
logger = get_polling_logger.get_logger(__name__)
active_tasks: set[asyncio.Task] = set()

class LoadingDevice():
	"""Класс для управления состоянием загрузки устройств. / Class to manage the loading state of devices."""
	loading: set[str] = set()

	@classmethod
	def add(cls, data: str):
		"""Добавить устройство в состояние загрузки. / Add device to the loading state."""
		cls.loading.add(data)

	@classmethod
	def has(cls, data: str):
		"""Проверить, находится ли устройство в состоянии загрузки. / Check if the device is in the loading state."""
		return data in cls.loading
	
	@classmethod
	def remove(cls, data):
		"""Удалить устройство из состояния загрузки. / Remove device from the loading state."""
		if cls.has(data):
			cls.loading.remove(data)

async def init_device(device_data: DeviceSerializeSchema):
	"""
	Инициализация устройства и добавление его в DevicesArray, если успешно.
	/ Initialize a device and add it to the DevicesArray if successful.
	
	Инициализация устройства, проверка его подключения и обновление полей, если необходимо.
	Если устройство не поддерживается или оффлайн, возвращается соответствующий статус.
	/ Initialize device, check connection status and update fields if needed.
	If device is not supported or offline, return the corresponding status.
	"""
	device_class = DeviceClasses.get(device_data.class_device)
	if not device_class:
		logger.error(f"Device class {device_data.class_device} not supported.")  # Логирование неподдерживаемого класса устройства
		return StatusDevice.NOT_SUPPORTED
	
	# Инициализация устройства / Device initialization
	device = device_class(device_data)
	await device.async_init()
	await device.save()
	device.close()
	del device
	new_device_data = await get_serialize_device(device_data.system_name)
	device = device_class(new_device_data)
	# Проверка подключения устройства / Check if device is connected
	if not device.is_conected:
		logger.warning(f"Device {device_data.system_name} is offline.")  # Логирование оффлайн устройства
		return StatusDevice.OFFLINE

	# Обновление полей, если необходимо / Update fields if necessary
	if device_class.device_config.init_field:
		await edit_fields(device_data.system_name, [x._get_initial_data() for x in device.get_fields()])

	# Добавление устройства в DevicesArray / Add device to DevicesArray
	DevicesArray.add_device(device_data.system_name, device)
	return device

async def polling(device_data: DeviceSerializeSchema):
	"""
	Функция опроса для одного устройства.
	/ Polling function for a single device.
	
	Эта функция проверяет статус устройства и извлекает последние данные, если устройство онлайн.
	Также управляет состояниями загрузки и обновляет статус устройства соответственно.
	/ This function checks the device status and fetches the latest data if the device is online.
	It also manages loading states and updates the device status accordingly.
	"""
	try:
		logger.info(f"Starting polling for device: {device_data.system_name}")

		if LoadingDevice.has(device_data.system_name):
			logger.info(f"p8 Device {device_data.system_name} is already being polled.")
			return  # Пропускаем устройство, если оно уже в состоянии загрузки / Skip if already in loading state

		LoadingDevice.add(device_data.system_name)

		# Обработка статуса UNLINK / Handle unlink status
		if device_data.status == StatusDevice.UNLINK:
			update_device_in_poll(get_default_data(device_data, StatusDevice.UNLINK))
			LoadingDevice.remove(device_data.system_name)
			return 

		# Обработка подключения устройства / Handle device connection
		connection_device_item = DevicesArray.get(device_data.system_name)
		logger.info(f"connect item: {connection_device_item}")
		if not connection_device_item:
			device = await init_device(device_data)
			if device == StatusDevice.NOT_SUPPORTED or device == StatusDevice.OFFLINE:
				update_device_in_poll(get_default_data(device_data, device))
				LoadingDevice.remove(device_data.system_name)
				return
			connection_device = device
		else:
			connection_device = connection_device_item.device

		# Обработка данных для устройств с методом PULL / Handle data retrieval for devices with PULL method
		if connection_device.get_type_get_data() == DeviceGetData.PULL:
			logger.info(f"start load {device_data.system_name} data: {connection_device}")
			connection_device.load()
			await connection_device.load_async()
			logger.info(f"end load {device_data.system_name} data: {connection_device}")

		# Обновление статуса устройства и данных / Update device status and data
		data = connection_device.get_schema()
		data.status = StatusDevice.ONLINE
		logger.info(f"Device {device_data.system_name} data: {data}")
		update_device_in_poll(data)

		# LoadingDevice.remove(device_data.system_name)
	except Exception as e:
		logger.error(f"Error polling device {device_data.system_name}: {e}")
		element = DevicesArray.get(device_data.system_name)
		# LoadingDevice.remove(device_data.system_name)

		if element:
			DevicesArray.delete(device_data.system_name)
		
		update_device_in_poll(get_default_data(device_data, StatusDevice.OFFLINE))
	finally:
		LoadingDevice.remove(device_data.system_name)
		
		active_tasks.discard(asyncio.current_task())
		# asyncio.current_task().cancel()


def handle_task_done(task: asyncio.Task):
	active_tasks.discard(task)
	if exception := task.exception():
		logger.error(f"Ошибка в задаче: {exception}")

async def polling_all():
	"""Функция для опроса всех устройств асинхронно. / Poll all devices asynchronously."""
	try:
		logger.info('Starting polling for all devices.')
		devices_data = await get_cached_device_data()
		logger.info(f"Found {len(devices_data)} devices to poll.")

		for device in devices_data:
			task = asyncio.create_task(polling(device), name=f"polling device: {device.system_name}")
			task.add_done_callback(handle_task_done)
			active_tasks.add(task)

		logger.info('Polling for all devices initiated.')
	finally:
		pass
		# asyncio.current_task().cancel()
	

async def stop_all_tasks():
	logger.info("Stopping all active polling tasks.")
	for task in active_tasks:
		task.cancel()
	await asyncio.gather(*active_tasks, return_exceptions=True)
	active_tasks.clear()

async def restart_polling():
	logger.info('Restarting polling process.')
	await stop_all_tasks()  # Остановка предыдущих задач

	frequency = __config__.get(FREQUENCY)
	interval = int(frequency.value) if frequency and frequency.value else 6
	loop.register(LOOP_DEVICE_POLLING, polling_all, interval)