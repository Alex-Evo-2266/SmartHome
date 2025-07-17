import os

MYSQL_USER = os.environ.get("SMARTHOME_BD_USER")
MYSQL_PASSWORD = os.environ.get("SMARTHOME_BD_PASSWORD")
MYSQL_DATABASE = os.environ.get("SMARTHOME_BD_NAME")
MYSQL_HOST = os.environ.get("SMARTHOME_BD_HOST")
MYSQL_PORT = os.environ.get("SMARTHOME_BD_PORT")

DEBUG = True

DATA_QUEUE = os.environ.get("DATA_QUEUE")
DATA_LISTEN_QUEUE = os.environ.get("DATA_LISTEN_QUEUE")
DATA_DEVICE_QUEUE = os.environ.get("DATA_DEVICE_QUEUE")

EXCHANGE_DEVICE_DATA = os.environ.get("EXCHANGE_DEVICE_DATA")
EXCHANGE_ROOM_DATA = os.environ.get("EXCHANGE_ROOM_DATA")

RABITMQ_HOST = os.environ.get("RABITMQ_HOST")
RABITMQ_PORT = os.environ.get("RABITMQ_PORT")

# запрос на обновление состояния устройст
DEVICE_VALUE_SEND = os.environ.get("DEVICE_VALUE_SEND")