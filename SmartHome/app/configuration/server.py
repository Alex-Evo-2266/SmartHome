from app.lifespan.startup import startup
from app.lifespan.shutdown import shutdown
from app.api.websocket.websocket import websocket_endpoint
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.openapi.utils import get_openapi
from app.pkg.routes import __routes__
from app.db.ormar.dbormar import database
from app.bootstrap.const import MEDIA_DIR
from app.bootstrap.settings import DEBUG, ORIGINS

import logging
# logging.disable(logging.CRITICAL)
logging.basicConfig(
    level=logging.WARNING,
    format="%(filename)s: %(asctime)s - %(levelname)s - %(message)s"
)

def custom_openapi(app:FastAPI):
	def _custom_openapi():
		if app.openapi_schema:
			return app.openapi_schema
		openapi_schema = get_openapi(
			title="Device service",
			version="1.0.0",
			routes=app.routes,
		)
		openapi_schema["paths"]["/ws/base"] = {
			"get": {
				"summary": "WebSocket connection",
				"description": "Connect to the WebSocket server. Send a message and receive a response.",
				"responses": {
					"101": {
						"description": "Switching Protocols - The client is switching protocols as requested by the server.",
					}
				}
			}
		}
		app.openapi_schema = openapi_schema
		return app.openapi_schema
	return _custom_openapi

class Server:
	
	__app: FastAPI

	def __init__(self, app: FastAPI):
		
		self.__app = app

		app.openapi = custom_openapi(app)

		if DEBUG:
			app.mount("/media", StaticFiles(directory=MEDIA_DIR), name="media")
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
