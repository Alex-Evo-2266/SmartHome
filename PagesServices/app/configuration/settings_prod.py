import os

DEBUG = False

DATA_TOPIC = os.environ.get("DATA_TOPIC")
DATA_QUEUE = os.environ.get("DATA_QUEUE")
DATA_DEVICE_QUEUE = os.environ.get("DATA_DEVICE_QUEUE")
DATA_LISTEN_QUEUE = os.environ.get("DATA_LISTEN_QUEUE")

EXCHANGE_DEVICE_DATA = os.environ.get("EXCHANGE_DEVICE_DATA")


RABITMQ_HOST = os.environ.get("RABITMQ_HOST")
RABITMQ_PORT = os.environ.get("RABITMQ_PORT")