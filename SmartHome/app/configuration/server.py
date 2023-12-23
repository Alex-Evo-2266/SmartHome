from app.ingternal.events.startup import startup
from app.ingternal.events.shutdown import shutdown
from app.ingternal.events.websocket import websocket_endpoint
from fastapi import FastAPI
from app.configuration.routes import __routes__


class Server:
	
	__app: FastAPI

	def __init__(self, app: FastAPI):
		
		self.__app = app
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
