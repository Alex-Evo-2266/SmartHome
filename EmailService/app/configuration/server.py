from app.internal.events.startup import startup
from app.internal.events.shutdown import shutdown
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.configuration.routes import __routes__
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

		self.__register_events(app)
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
