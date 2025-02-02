import logging
from app.ingternal.modules.arrays.serviceDataPoll import servicesDataPoll
from app.ingternal.device.serialize_model.value_set import save_value
from app.ingternal.device.arrays.DeviceRegistry import DeviceRegistry
from app.configuration.loop.loop import loop
from app.configuration.settings import DEVICE_DATA_POLL, SAVE_DEVICE_CONF, LOOP_SAVE_DEVICE
from app.pkg import __config__

logger = logging.getLogger(__name__)

async def save_devices():
	"""
	Функция сохранения данных устройств.
	"""
	# Получение списка зарегистрированных устройств
	device_list: DeviceRegistry | None = servicesDataPoll.get(DEVICE_DATA_POLL)
	if not device_list:
		logger.warning("Invalid key: DEVICE_DATA_POLL not found in servicesDataPoll.")
		return

	schemas = device_list.get_all_data()

	logger.info(f"Found {len(schemas)} devices to save.")
	# Обработка каждого устройства
	for schema in schemas:
		logger.info(f"try seve {schema}")
		await save_device(schema)
	

async def save_device(schema):
	try:
		await save_value(schema)
		logger.info(f"Successfully saved data for device: {schema.system_name}")
	except Exception as e:
		logger.error(f"Failed to save device {schema.system_name}: {e}")

async def restart_save_data():
	save_device_conf = __config__.get(SAVE_DEVICE_CONF)

	if save_device_conf and save_device_conf.value and save_device_conf.value != '':
		loop.register(LOOP_SAVE_DEVICE, save_devices, int(save_device_conf.value))
		logger.info(f"Device saving loop registered with frequency: {save_device_conf.value}")
	else:
		loop.register(LOOP_SAVE_DEVICE, save_devices, 6)
		logger.warning("SAVE_DEVICE_CONF not found in config, skipping device save loop registration.")
