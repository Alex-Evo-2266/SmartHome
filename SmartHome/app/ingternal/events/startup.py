import logging, asyncio
from app.pkg import itemConfig, ConfigItemType, __config__
from app.configuration.loop.loop import EventLoop
from app.pkg.ormar.dbormar import database
from app.configuration.settings import FREQUENCY, DEFAULT_SAVE_INTERVAL

from app.ingternal.device.device_data.send_device import send_restart
from app.ingternal.device.device_data.save_device import save_device

logger = logging.getLogger(__name__)

async def startup():

	database_ = database
	if not database_.is_connected:
		await database_.connect()

	__config__.register_config(itemConfig(
		tag="device service",
		key=FREQUENCY,
		type=ConfigItemType.NUMBER
	))

	logger.info("generete config")

	await __config__.load()

	EventLoop.register("saveDevice", save_device, DEFAULT_SAVE_INTERVAL)
	await send_restart(__config__)

	loop = asyncio.get_running_loop()
	loop.create_task(EventLoop.run())
	  
	logger.info("starting")
