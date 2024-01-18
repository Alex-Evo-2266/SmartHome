import logging, asyncio
from fastapi import FastAPI
from app.configuration.initialization.config import init_conf
from app.configuration.initialization.app import init_dir
from app.ingternal.authtorization.initialization.init_admin import init_admin
from app.configuration.loop.loop import EventLoop
from app.ingternal.device.save_device import save_device
from app.ingternal.device.send_device import send_restart
from app.ingternal.device.communication_fields.communications import CommunicationFields

from app.modules.modules import init_modules

from app.configuration.settings import DEFAULT_SAVE_INTERVAL

from app.pkg.ormar.dbormar import database

logger = logging.getLogger(__name__)

async def startup():
	
	print("sdfg")
	await init_dir()
	EventLoop.register("saveDevice", save_device, DEFAULT_SAVE_INTERVAL)
	init_conf()
	await send_restart()
	await init_modules()
	database_ = database
	if not database_.is_connected:
		await database_.connect()
		
	loop = asyncio.get_running_loop()
	loop.create_task(EventLoop.run())

	await init_admin()
	await CommunicationFields.load_communications()
	logger.info("starting")
