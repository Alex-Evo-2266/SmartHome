import logging, asyncio
from app.pkg import itemConfig, ConfigItemType, __config__
from app.configuration.loop.loop import loop
from app.pkg.ormar.dbormar import database
from app.configuration.settings import FREQUENCY, SEND_DEVICE_CONF

from app.ingternal.device.polling import restart_polling
from app.ingternal.device.send import restart_send_device_data
from app.moduls import getModule

from app.ingternal.device.arrays.DeviceClasses import DeviceClasses

from app.ingternal.modules.arrays.serviceArray import ServiceArray

logger = logging.getLogger(__name__)



async def startup():

	database_ = database
	if not database_.is_connected:
		await database_.connect()

	__config__.register_config(itemConfig(
		tag="device service",
		key=FREQUENCY,
		type=ConfigItemType.NUMBER
	), restart_polling)

	__config__.register_config(itemConfig(
		tag="device service",
		key=SEND_DEVICE_CONF,
		type=ConfigItemType.NUMBER
	), restart_send_device_data)


	getModule()

	print(DeviceClasses.all())
	print(ServiceArray.services)
	await ServiceArray.start()

	logger.info("generete config")

	await __config__.load()

	loop.start()
	  
	logger.info("starting")

	# await add_device(AddDeviceSchema(
	# 	name='test1',
	# 	system_name='test1',
	# 	class_device='test_class',
	# 	type="test_type",
	# 	address='1234',
	# 	device_enable=True,
	# 	fields=[AddDeviceFieldSchema(
	# 		name='test_field',
	# 		address='123456789',
	# 		type=TypeDeviceField.NUMBER,
	# 		read_only=False,
	# 		virtual_field=True
	# 	)]
	# ))
