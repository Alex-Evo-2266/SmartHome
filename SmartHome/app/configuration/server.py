from app.ingternal.events.startup import startup
from app.ingternal.events.shutdown import shutdown
from app.ingternal.events.websocket import websocket_endpoint
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.configuration.routes import __routes__
from app.pkg.ormar.dbormar import database
from app.configuration.settings import MEDIA_ROOT, DEBUG, ORIGINS



class Server:
	
	__app: FastAPI

	def __init__(self, app: FastAPI):
		
		self.__app = app

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

		app.state.database = database

		self.__register_events(app)
		self.__register_websocet(app)
		self.__register_routes(app)
		

	def get_app(self) -> FastAPI:

		return self.__app
	
	@staticmethod
	def __register_events(app):
		
		app.on_event("startup")(startup)

		app.on_event("shutdown")(shutdown)

	@staticmethod
	def __register_routes(app):
		
		__routes__.register_routes(app)

	@staticmethod
	def __register_websocet(app):
		app.websocket("/ws/base")(websocket_endpoint)
