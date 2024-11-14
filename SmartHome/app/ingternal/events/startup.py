import logging, asyncio
from app.pkg import itemConfig, ConfigItemType, __config__
from app.configuration.loop.loop import loop
from app.pkg.ormar.dbormar import database
from app.configuration.settings import FREQUENCY, SEND_DEVICE_CONF

# from app.ingternal.device.device_data.send_device import send_restart
# from app.ingternal.device.device_data.save_device import save_device
# from app.ingternal.device.CRUD.create import add_device
# from app.ingternal.device.schemas.add_device import AddDeviceSchema, AddDeviceFieldSchema
# from app.ingternal.device.schemas.enums import TypeDeviceField
from app.ingternal.device.polling import restart_polling
from app.ingternal.device.send import restart_send_device_data

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

	logger.info("generete config")

	await __config__.load()

	# loop.register("saveDevice", test, 2)
	loop.start()

	# EventLoop.register("saveDevice", save_device, DEFAULT_SAVE_INTERVAL)
	# await send_restart(__config__)

	# loop = asyncio.get_running_loop()
	# loop.create_task(EventLoop.run())
	  
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
