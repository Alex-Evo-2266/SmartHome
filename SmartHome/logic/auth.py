from models import User,genId,MenuElement
from schemas.auth import Login
import logging
import bcrypt
from datetime import datetime, timedelta
import jwt
import settings

logger = logging.getLogger(__name__)

async def login(data: Login):
    try:
        logger.debug(f"login input data: {data.dict()}")
        u = await User.objects.get_or_none(UserName=data.name)
        if not u:
            logger.error(f"user not found")
            return {"status":"error", "detail":"user not found"}
        if bcrypt.checkpw(data.password.encode('utf-8'),u.UserPassword.encode('utf-8')):
            encoded_jwt = await create_token(u.id)
            result = {"token":encoded_jwt, "userId":u.id,"userLavel":u.UserLevel}
            logger.info(f"login user: {u.UserName}, id: {u.id}")
            return {"status":"ok","data":result}
        return {"status":"error", "detail":"invalid data"}
    except Exception as e:
        logger.error(f"user does not exist. detail: {e}")
        return {"status":"error", "detail":e}

async def create_token(user_id:int):
    access_toket_expire = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return await create_access_token(
                data = {'user_id':user_id,},
                expires_delta = access_toket_expire
            )

async def create_access_token(data: dict, expires_delta: timedelta = timedelta(minutes=15)):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({'exp': expire, 'sub': 'access'})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_JWT_KEY, algorithm = settings.ALGORITHM)
    return encoded_jwt

async def auth(Authorization):
    try:
        head = Authorization
        jwtdata = head
        jwtdata = head.split(" ")[1]
        data = jwt.decode(jwtdata,settings.SECRET_JWT_KEY,algorithms=[settings.ALGORITHM])
        if not('exp' in data and 'user_id' in data):
            logger.worning(f"no data in jwt")
            return {'type':'error'}
        if (datetime.utcnow() > datetime.fromtimestamp(data['exp'])):
            logger.debug(f"outdated jwt")
            return {'type':'outdated_jwt'}
        user = await User.objects.get(id=data['user_id'])
        logger.info(f"the user is logged in. id:{data['user_id']}")
        return {'type':'ok', 'user_id':data['user_id'], 'user_level':user.UserLevel}
    except Exception as e:
        return {'type':'error', 'detail':e}
