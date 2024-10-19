from pathlib import Path
import datetime
import os
from enum import Enum


try:
    from app.configuration.settings_local import *
except Exception as e:
    from app.configuration.settings_prod import *


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
SECRET_JWT_KEY = "smart-home-auth-cxgjhmngfxdfng45"
SECRET_REFRESH_JWT_KEY = "smart-home-auth-cxgjhmngnfgj6r4ehr"

BASE_DIR = Path(__file__).resolve().parent.parent.parent

SCRIPT_AUTOMATION_PREFEX = "automation"

SERVER_CONFIG = os.path.join(BASE_DIR, "files","server-config.yml")

ROUTE_PREFIX = "/api-auth"

TIMEZONE = datetime.timezone(datetime.timedelta(hours=3))

# DEFAULT_SEND_INTERVAL = 6
# DEFAULT_SEND_SERVER_DATA_INTERVAL = 30
# DEFAULT_SAVE_INTERVAL = 10

MEDIA_URL = '/media/'
# MODULES_URL = '/media/modules/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
# BACKGROUND_DIR = os.path.join(MEDIA_ROOT, 'backgrounds')
# MODULES_DIR = os.path.join(MEDIA_ROOT, 'modules')

ADMIN_BASE_LOGIN = "admin"
ADMIN_BASE_PASSWORD = "admin"

class BASE_ROLE(str, Enum):
	ADMIN = "admin"
	BASE = "base"