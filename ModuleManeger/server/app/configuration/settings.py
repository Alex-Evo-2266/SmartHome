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
MODULES_DIR = os.path.join(BASE_DIR, "modules")