import os

MYSQL_USER = os.environ.get("SMARTHOME_BD_USER")
MYSQL_PASSWORD = os.environ.get("SMARTHOME_BD_PASSWORD")
MYSQL_DATABASE = os.environ.get("SMARTHOME_BD_NAME")
MYSQL_HOST = os.environ.get("SMARTHOME_BD_HOST")
MYSQL_PORT = os.environ.get("SMARTHOME_BD_PORT")

DEBUG = False
