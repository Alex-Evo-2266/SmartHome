from models import User,genId,MenuElement
from schemas.user import UserForm
import logging
import bcrypt
from datetime import datetime, timedelta
import jwt
import settings

logger = logging.getLogger(__name__)

def isUser(data, name):
    for item in data:
        if(item.UserName == name):
            return item
    return None

async def addUser(data: UserForm):
    try:
        # logger.debug(f"add user input data: {data.dict()}")
        hashedPass = bcrypt.hashpw(data.password.encode('utf-8'), bcrypt.gensalt())
        cond = await User.objects.get_or_none(UserName=data.name)
        if(cond):
            return {'status':'error', 'detail':'such user already exists.'}
        newUser = await User.objects.create(UserName=data.name, UserEmail=data.email, UserMobile=data.mobile,UserPassword=hashedPass)
        message = "login = " + data.name + "\npassword = " + data.password
        # logger.info(f"login input data: {data.dict()}")
        # send_email("Account smart home",data.get("email"),message)
        return {'status':'ok'}
    except Exception as e:
        logger.error(f"error add user: {e}")
        return {'status': 'error', 'detail': e}
