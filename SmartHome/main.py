import asyncio, logging
import app.device.type_class.init_types

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
# from SmartHome.logic.device.send_device import send_device
from app.authtorization.init_admin import init_admin

# from test import test

from modules.modules import init_modules

from app.dbormar import metadata, database, engine
from app.loop.call_functions import RunFunctions
from app.weather.weather import updateWeather
# from SmartHome.logic.device.sendDevice import sendDevice
from app.websocket import WebSocketMenager
from app.settings import configManager
# from SmartHome.logic.server.server_data import send_server_data
# from SmartHome.logic.script.runScript import runTimeScript
from app.device.save_device import save_device

from app.config.config_init import conf_init
from app.init_app.initapp import initdir

# from SmartHome.api.first_start import router as router_first_start
from app.authtorization.api import router as router_auth
from app.authtorization.api_user import router as router_user
from app.authtorization.api_style import router as router_style
from app.menu.api import router as router_menu
from app.device.api import router as router_device
from app.device.send_device import send_restart
# from SmartHome.api.homePage import router as router_homePage
from app.server.api import router as router_server
# from SmartHome.api.script import router as router_script
# from SmartHome.api.deviceGroup import router_groups
# from SmartHome.api.moduls import router_moduls
# from SmartHome.api.pages import router_pages
# from SmartHome.api.file import router as router_file
from app.settings import MEDIA_ROOT, MEDIA_URL, DEBUG, ORIGINS, DEFAULT_SEND_SERVER_DATA_INTERVAL, DEFAULT_SAVE_INTERVAL, DEFAULT_SEND_INTERVAL

logger = logging.getLogger(__name__)

# app = FastAPI()

# logging.basicConfig(encoding='utf-8', level=logging.INFO)

if DEBUG:
	app.mount("/media", StaticFiles(directory=MEDIA_ROOT), name="media")
else:
	app.add_middleware(
		CORSMiddleware,
		allow_origins=ORIGINS,
		allow_credentials=True,
		allow_methods=["*"],
		allow_headers=["*"],
	)

# metadata.create_all(engine)
app.state.database = database

@app.on_event("startup")
async def startup() -> None:
	await initdir()
	RunFunctions.subscribe("weather", updateWeather, 43200)
	# RunFunctions.subscribe("script", runTimeScript, 60)
	# RunFunctions.subscribe("serverData", send_server_data, DEFAULT_SEND_SERVER_DATA_INTERVAL)
	RunFunctions.subscribe("saveDevice", save_device, DEFAULT_SAVE_INTERVAL)
	conf_init()
	await send_restart()
	# base = configManager.getConfig("send_message")
	# if base and "frequency" in base:
	# 	RunFunctions.subscribe("devices", send_device, int(base['frequency']))
	# else:
	# 	RunFunctions.subscribe("devices", send_device, DEFAULT_SEND_INTERVAL)
	await init_modules()
	database_ = app.state.database
	if not database_.is_connected:
		await database_.connect()
	loop = asyncio.get_running_loop()
	loop.create_task(RunFunctions.run())
	await init_admin()
	logger.info("starting")
	# test()


@app.on_event("shutdown")
async def shutdown() -> None:
	database_ = app.state.database
	if database_.is_connected:
		await database_.disconnect()

@app.websocket("/ws/base")
async def websocket_endpoint(websocket: WebSocket):
	await WebSocketMenager.connect(websocket)
	try:
		while True:
			data = await websocket.receive_text()
	except WebSocketDisconnect:
		WebSocketMenager.disconnect(websocket)

# app.include_router(router_first_start)
app.include_router(router_auth)
app.include_router(router_menu)
app.include_router(router_server)
app.include_router(router_device)
# app.include_router(router_script)
app.include_router(router_style)
# app.include_router(router_file)
# app.include_router(router_groups)
# app.include_router(router_homePage)
app.include_router(router_user)
# app.include_router(router_moduls)
# app.include_router(router_pages)

# class Config(DefConfig):
# 	address = True

# class Test(metaclass=DeviceMeta, config=Config):
# 	def test_put(self):
# 		print("test")
# from SmartHome.logic.deviceClass.typeDevice.BaseType import BaseType
	
# print(str(BaseType))
# print(BaseType.__name__)