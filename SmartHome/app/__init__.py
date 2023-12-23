
from fastapi import FastAPI
from app.pkg.ormar.models import *
from app.configuration.server import Server

def create_app(_=None) -> FastAPI:

    app = FastAPI()

    return Server(app).get_app()