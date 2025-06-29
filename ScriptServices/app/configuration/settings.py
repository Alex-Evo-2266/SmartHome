from pathlib import Path
import datetime
import os, sys, logging


try:
    # from app.configuration.settings_local import *
    raise Exception()
except Exception as e:
    from app.configuration.settings_prod import *


DB_URL = "".join(["mysql+pymysql://",
    MYSQL_USER,":",
    MYSQL_PASSWORD,"@",
    MYSQL_HOST,":",MYSQL_PORT,"/",
    MYSQL_DATABASE])
print("bd: ",DB_URL)


ORIGINS = ["localhost",'127.0.0.1','192.168.0.9','192.168.0.4']

BASE_DIR = Path(__file__).resolve().parent.parent.parent

SCRIPT_AUTOMATION_PREFEX = "automation"

MODULS_DIR = os.path.join(BASE_DIR, "app","moduls")

TIME_UPPDATA = 6
LENGTHPASS = 10


LOGS_DIR = os.path.join(BASE_DIR, 'logs')
LOGS_LEVEL = logging.DEBUG
