
from fastapi import FastAPI
import logging
from app.configuration.server import Server

def create_app(_=None) -> FastAPI:

    app = FastAPI()

    return Server(app).get_app()