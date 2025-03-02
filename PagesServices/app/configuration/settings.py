from pathlib import Path
import datetime
import os

# try:
#     from app.configuration.settings_local import *
# except Exception as e:
#     from app.configuration.settings_prod import *
from app.configuration.settings_prod import *


ORIGINS = ["localhost",'127.0.0.1','192.168.0.9','192.168.0.4']


ALGORITHM = 'HS256'
ACCESS_TOKEN_EXPIRE_MINUTES = 15
REFRESH_TOKEN_EXPIRE_MINUTES = 60 * 24 * 2
SECRET_JWT_KEY = "smart-home-auth-cxgjhmngfxdfng45"
SECRET_REFRESH_JWT_KEY = "smart-home-auth-cxgjhmngnfgj6r4ehr"

BASE_DIR = Path(__file__).resolve().parent.parent.parent
MODULES_DIR = os.path.join(BASE_DIR, "app", "moduls")

SCRIPT_AUTOMATION_PREFEX = "automation"

CONFIG_DIR = os.path.join(BASE_DIR, "config")
CONFIG_FILE_NAME = 'service_config'
ROUTE_PREFIX = "/api-pages"
CONFIG_TAG = "pages-config"

#poll keys
DEVICE_DATA_POLL = "poll-device-data"
SERVICE_DATA_POLL = "poll-service-data"

TIMEZONE = datetime.timezone(datetime.timedelta(hours=3))

# DEFAULT_SEND_INTERVAL = 6
# DEFAULT_SEND_SERVER_DATA_INTERVAL = 30
# DEFAULT_SAVE_INTERVAL = 10

MEDIA_URL = '/media/'
# MODULES_URL = '/media/modules/'
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
# BACKGROUND_DIR = os.path.join(MEDIA_ROOT, 'backgrounds')
# MODULES_DIR = os.path.join(MEDIA_ROOT, 'modules')

