from pathlib import Path
import datetime
import os
from enum import Enum

# try:
#     from app.configuration.settings_local import *
# except Exception as e:
#     from app.configuration.settings_prod import *
from app.configuration.settings_prod import *

ORIGINS = ["localhost",'127.0.0.1','192.168.0.9','192.168.0.4']

ROUTE_PREFIX = "/api-modules-manager"

BASE_DIR = Path(__file__).resolve().parent.parent.parent

CONFIG_SERVICES_DIR = os.path.join(BASE_DIR, "config_services") 
CONFIG_DIR = os.path.join(BASE_DIR, "config") 
MODULES_DIR = os.path.join(BASE_DIR, "modules")
CORE_MODULES_DIR = os.path.join(BASE_DIR, "modules_core")
CACHE_FILE = os.path.join(CONFIG_DIR, "modules_cache.json")
CACHE_INFO_FILE = os.path.join(CONFIG_DIR, "modules_info_cache.json")
DATA_FILE = os.path.join(CONFIG_DIR, "data.json")
ENV_FILE = os.path.join(BASE_DIR, ".env")

URL_REPO_MODULES_LIST = "https://github.com/Alex-Evo-2266/SmartHome_Modules_List"

ROOT_APP_DIR = os.environ.get("ROOT_APP_DIR")
COMPOSE_FILE_CORE_MODULE = os.path.join(ROOT_APP_DIR, "docker-compose-traefik.yml")
CONFIGURATE_DIR = os.environ.get("CONFIGURATE_DIR")

GIT_HUB_TOKEN = None
GIT_HUB_KEY = "github_key"


DEVICE_SERVICE = "device_service"

# config
CONFIG_FILE_NAME = 'service_config'
CONFIG_TAG = "device-config"