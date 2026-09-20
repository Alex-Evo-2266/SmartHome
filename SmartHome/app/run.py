
from fastapi import FastAPI
import logging
from app.configuration.server import Server

def create_app(_=None) -> FastAPI:

    # logging.basicConfig(encoding='utf-8', level=logging.DEBUG)

    app = FastAPI()

    return Server(app).get_app()