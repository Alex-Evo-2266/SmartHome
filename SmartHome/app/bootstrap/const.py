from pathlib import Path
import datetime
import os, sys, logging

TIME_UPPDATA = 6
LENGTHPASS = 10

TIMEZONE = datetime.timezone(datetime.timedelta(hours=3))

BASE_DIR = Path(__file__).resolve().parent.parent.parent

MEDIA_DIR = os.path.join(BASE_DIR, 'media')
MODULES_DIR = os.path.join(MEDIA_DIR, 'modules')

MODULS_DIR = os.path.join(BASE_DIR, "app","moduls","moduls")
MODULES_URL = '/media/device/modules/'

DEFAULT_SEND_INTERVAL = 6
DEFAULT_SEND_SERVER_DATA_INTERVAL = 30
DEFAULT_SAVE_INTERVAL = 10

# config
CONFIG_DIR = os.path.join(BASE_DIR, "config")
CONFIG_FILE_NAME = 'service_config'
ROUTE_PREFIX = "/api-devices"
CONFIG_TAG = "device-config"

#websocket key
TYPE_SEND_DEVICE = "device-send"
TYPE_SEND_PATCH_DEVICE = "device-send-patch"
TYPE_SEND_ROOT = "send_room"
TYPE_SEND_PATCH_ROOT = "send_room_patch"

#poll keys
SERVICE_DATA_POLL = "poll-service-data"
SERVICE_POLL = "poll-service"

# config keys
POLLING_INTERVAL = 'pooling_interval'
SEND_DEVICE_CONF = 'send-device-data'
SAVE_DEVICE_CONF = 'save-device-data'

# loop key
LOOP_DEVICE_POLLING = 'device-polling'
LOOP_SEND_DEVICE = 'send-device-data'
LOOP_SAVE_DEVICE = 'save-device-data'
LOOP_AUTOMATION = 'automation-loop'
