import logging
from app.authtorization.schema import UserLevel
import bcrypt
from app.authtorization.models import AuthType, User

logger = logging.getLogger(__name__)

async def init_admin():
    users = await User.objects.all()
    if len(users) == 0:
        await add_admin()

async def add_admin():
    try:
        logger.debug(f"add admin")
        hashedPass = bcrypt.hashpw("admin".encode('utf-8'), bcrypt.gensalt())
        newUser = await User.objects.create(name="admin", email="", password=hashedPass, role=UserLevel.ADMIN, auth_type=AuthType.LOGIN)
    except Exception as e:
        logger.error(f"error add user: {e}")
        raise
