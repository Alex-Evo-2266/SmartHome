from django.conf import settings
import jwt
from datetime import datetime, timedelta
from ..models import User
import logging

logger = logging.getLogger(__name__)

def create_token(user_id:int):
    access_toket_expire = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    return  create_access_token(
                data = {'user_id':user_id,},
                expires_delta = access_toket_expire
            )

def create_access_token(data: dict, expires_delta: timedelta = timedelta(minutes=15)):
    to_encode = data.copy()
    expire = datetime.utcnow() + expires_delta
    to_encode.update({'exp': expire, 'sub': 'access'})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_JWT_KEY, algorithm = settings.ALGORITHM)
    return encoded_jwt

def auth(request):
    if "Authorization" in request.headers:
        head = request.headers["Authorization"]
        jwtdata = head.split(" ")[1]
        data = jwt.decode(jwtdata,settings.SECRET_JWT_KEY,algorithms=[settings.ALGORITHM])
        if not('exp' in data and 'user_id' in data):
            logger.worning(f"no data in jwt")
            return {'type':'error'}
        if (datetime.utcnow() > datetime.fromtimestamp(data['exp'])):
            logger.debug(f"outdated jwt")
            return {'type':'outdated_jwt'}
        user = User.objects.get(id=data['user_id'])
        logger.info(f"the user is logged in. id:{data['user_id']}")
        return {'type':'ok', 'user_id':data['user_id'], 'user_level':user.UserLevel}
    logger.worning(f"no Authorization header")
    return {'type':'error'}
