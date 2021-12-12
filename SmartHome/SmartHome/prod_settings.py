import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

DEBUG = False

ALLOWED_HOSTS = ["localhost",'127.0.0.1','192.168.0.9','192.168.0.4']

SECRET_KEY = 'wse5dr6ft7yg8plivkuytrrestrytfygui'

SECRET_JWT_KEY = "dxkhbg5hth56"

CORS_ALLOWED_ORIGINS  = [
     "http://localhost:3000" ,
]
CSRF_TRUSTED_ORIGINS = [
     "localhost:3000" ,
]

REDIS_HOST = os.environ.get("SMARTHOME_REDIS_HOST")
REDIS_PORT = os.environ.get("SMARTHOME_REDIS_PORT")

BD_HOST = os.environ.get("SMARTHOME_BD_HOST")
BD_PORT = os.environ.get("SMARTHOME_BD_PORT")
BD_NAME = os.environ.get("SMARTHOME_BD_NAME")
BD_USER = os.environ.get("SMARTHOME_BD_USER")
BD_PASSWORD = os.environ.get("SMARTHOME_BD_PASSWORD")

SMART_HOME_HOST = os.environ.get("SMARTHOME_SOCKET_HOST")
SMART_HOME_PORT = os.environ.get("SMARTHOME_SOCKET_PORT")
