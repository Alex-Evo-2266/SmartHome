import logging
import bcrypt
import os
from SmartHome.models import User
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

async def initAdmin():
    users = await User.objects.all()
    if len(users) == 0:
        await addAdmin()

async def addAdmin():
    try:
        logger.debug(f"add admin")
        hashedPass = bcrypt.hashpw("admin".encode('utf-8'), bcrypt.gensalt())
        newUser = await User.objects.create(UserName="admin", UserEmail="", UserMobile="",UserPassword=hashedPass, UserLevel=3)
        return {'status':'ok'}
    except Exception as e:
        logger.error(f"error add user: {e}")
        return {'status': 'error', 'detail': e}
