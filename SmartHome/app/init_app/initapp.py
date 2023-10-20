import logging
import os
from app.settings import MEDIA_ROOT, BACKGROUND_DIR

logger = logging.getLogger(__name__)

async def initdir():
    if not os.path.exists(MEDIA_ROOT):
        os.mkdir(MEDIA_ROOT)
    if not os.path.exists(BACKGROUND_DIR):
        os.mkdir(BACKGROUND_DIR)
