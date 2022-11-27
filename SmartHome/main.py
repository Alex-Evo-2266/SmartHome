import asyncio, logging

from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from authtorization.initAdmin import initAdmin

from castom_moduls import init_modules

from SmartHome.dbormar import metadata, database, engine
from SmartHome.logic.call_functions import RunFunctions
from weather.weather import updateWeather
# from SmartHome.logic.device.sendDevice import sendDevice
from SmartHome.websocket import WebSocketMenager
from settings import configManager
from SmartHome.logic.server.serverData import sendServerData
# from SmartHome.logic.script.runScript import runTimeScript
# from SmartHome.logic.device.deviceSave import saveDevice

from config.configInit import confinit
from initapp import initdir

# from SmartHome.api.first_start import router as router_first_start
from authtorization.api import router as router_auth
from authtorization.api_user import router as router_user
from authtorization.api_style import router as router_style
from SmartHome.api.menu import router as router_menu
from SmartHome.api.device import router as router_device
# from SmartHome.api.homePage import router as router_homePage
from SmartHome.api.server import router as router_server
# from SmartHome.api.script import router as router_script
# from SmartHome.api.deviceGroup import router_groups
# from SmartHome.api.moduls import router_moduls
# from SmartHome.api.pages import router_pages
# from SmartHome.api.file import router as router_file
from settings import MEDIA_ROOT, MEDIA_URL, DEBUG, ORIGINS

from SmartHome.logic.deviceClass.DeviceMeta import DefConfig, DeviceMeta

logger = logging.getLogger(__name__)

app = FastAPI()

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
	RunFunctions.subscribe("serverData", sendServerData, 30)
	# RunFunctions.subscribe("saveDevice", saveDevice, 120)
	confinit()
	base = configManager.getConfig("base")
	# if "frequency" in base:
	#     RunFunctions.subscribe("devices", sendDevice, int(base['frequency']))
	# else:
	#     RunFunctions.subscribe("devices", sendDevice, 6)
	await init_modules()
	database_ = app.state.database
	if not database_.is_connected:
		await database_.connect()
	loop = asyncio.get_running_loop()
	loop.create_task(RunFunctions.run())
	await initAdmin()
	logger.info("starting")



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
	