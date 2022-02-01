from pathlib import Path
import os, sys

try:
    from .settings_local import *
except Exception as e:
    from .settings_prod import *


DB_URL = "".join(["mysql+pymysql://",
    MYSQL_USER,":",
    MYSQL_PASSWORD,"@",
    MYSQL_HOST,":",MYSQL_PORT,"/",
    MYSQL_DATABASE])
print("bd: ",DB_URL)


ORIGINS = ["localhost",'127.0.0.1','192.168.0.9','192.168.0.4']

ALGORITHM = 'HS256'
ACCESS_TOKEN_EXPIRE_MINUTES = 15
REFRESH_TOKEN_EXPIRE_MINUTES = 60 * 24 * 2
SECRET_JWT_KEY = "dxkhbg5hth56"
SECRET_REFRESH_JWT_KEY = "dxkhbgefrthjyuvligukytrtyug5hth56"

BASE_DIR = Path(__file__).resolve().parent.parent

SERVER_CONFIG = os.path.join(BASE_DIR, "files","server-config.yml")
DEVICETYPES = os.path.join(BASE_DIR, "files","devTypes.yml")
SCRIPTS_DIR = os.path.join(BASE_DIR, "files","scripts")
STYLES_DIR = os.path.join(BASE_DIR, "files","styles")
PAGES_DIR =  os.path.join(BASE_DIR, "files","pages")
DEVICES = os.path.join(BASE_DIR, "files","devices.yml")

TIME_UPPDATA = 6
LENGTHPASS = 10

MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
BACKGROUND_DIR = os.path.join(MEDIA_ROOT, 'backgrounds')
