import os

MYSQL_USER = os.environ.get("SMARTHOME_AUTH_BD_USER")
MYSQL_PASSWORD = os.environ.get("SMARTHOME_AUTH_BD_PASSWORD")
MYSQL_DATABASE = os.environ.get("SMARTHOME_AUTH_BD_NAME")
MYSQL_HOST = os.environ.get("SMARTHOME_AUTH_BD_HOST")
MYSQL_PORT = os.environ.get("SMARTHOME_AUTH_BD_PORT")

EMAIL_TOPIK = os.environ.get("EMAIL_TOPIK")
EMAIL_QUEUE = os.environ.get("EMAIL_QUEUE")

RABITMQ_HOST = os.environ.get("RABITMQ_HOST")
RABITMQ_PORT = os.environ.get("RABITMQ_PORT")

DEBUG = True
