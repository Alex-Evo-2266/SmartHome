import logging
from authtorization.schema import UserLevel
import bcrypt
from authtorization.models import AuthType, User

logger = logging.getLogger(__name__)

async def initAdmin():
    users = await User.objects.all()
    if len(users) == 0:
        await addAdmin()

async def addAdmin():
    try:
        logger.debug(f"add admin")
        hashedPass = bcrypt.hashpw("admin".encode('utf-8'), bcrypt.gensalt())
        newUser = await User.objects.create(name="admin", email="", password=hashedPass, role=UserLevel.ADMIN, auth_type=AuthType.LOGIN)
    except Exception as e:
        logger.error(f"error add user: {e}")
        raise
