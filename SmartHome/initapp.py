import logging
import os
from settings import SCRIPTS_DIR, DEVICES, MEDIA_ROOT, BACKGROUND_DIR, GROUPS, ROOMS

logger = logging.getLogger(__name__)

async def initdir():
    if not os.path.exists(DEVICES):
        file = open(DEVICES, "w+")
        file.close()
    if not os.path.exists(GROUPS):
        file = open(GROUPS, "w+")
        file.close()
    if not os.path.exists(ROOMS):
        file = open(ROOMS, "w+")
        file.close()
    if not os.path.exists(SCRIPTS_DIR):
        os.mkdir(SCRIPTS_DIR)
    if not os.path.exists(MEDIA_ROOT):
        os.mkdir(MEDIA_ROOT)
    if not os.path.exists(BACKGROUND_DIR):
        os.mkdir(BACKGROUND_DIR)
