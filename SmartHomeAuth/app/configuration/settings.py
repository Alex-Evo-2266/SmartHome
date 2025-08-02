from pathlib import Path
import datetime
import os
from enum import Enum


# try:
#     from app.configuration.settings_local import *
# except Exception as e:
#     from app.configuration.settings_prod import *
from app.configuration.settings_prod import *


DB_URL = "".join([
	"mysql+pymysql://",
    MYSQL_USER,":",
    MYSQL_PASSWORD,"@",
    MYSQL_HOST,":",MYSQL_PORT,"/",
    MYSQL_DATABASE
	])
print("bd: ",DB_URL)


ORIGINS = ["localhost",'127.0.0.1','192.168.0.9','192.168.0.4']


ALGORITHM = 'HS256'
ACCESS_TOKEN_EXPIRE_MINUTES = 15
REFRESH_TOKEN_EXPIRE_MINUTES = 60 * 24 * 2
MODULE_TOKEN_EXPIRE_MINUTES = 60 * 24
SECRET_JWT_KEY = "smart-home-auth-cxgjhmngfxdfng45"
SECRET_REFRESH_JWT_KEY = "smart-home-auth-cxgjhmngnfgj6r4ehr"
SECRET_MODULE_JWT_KEY = "smart-home-auth-xdfgnmcfjrdhxsfhjxdtklhx"

BASE_DIR = Path(__file__).resolve().parent.parent.parent

SCRIPT_AUTOMATION_PREFEX = "automation"

SERVER_CONFIG = os.path.join(BASE_DIR, "files","server-config.yml")

ROUTE_PREFIX = "/api-auth"

TIMEZONE = datetime.timezone(datetime.timedelta(hours=3))

MODULES_COOKIES_NAME = "module_auth_sh"


MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
CONFIG_SERVICES_DIR = os.path.join(BASE_DIR, "config_services") 

ADMIN_BASE_LOGIN = "admin"
ADMIN_BASE_PASSWORD = "admin"


class BASE_ROLE(str, Enum):
	ADMIN = "admin"
	BASE = "base"