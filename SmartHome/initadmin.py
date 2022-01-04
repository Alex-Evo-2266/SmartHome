import logging
import bcrypt
from SmartHome.models import User

logger = logging.getLogger(__name__)

async def initApp():
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
