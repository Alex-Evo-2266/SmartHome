# import logging
# import bcrypt
# import jwt

# from jwt import ExpiredSignatureError

# from datetime import datetime, timedelta
# from SmartHome.schemas.base import FunctionRespons, TypeRespons

# from SmartHome.models import User,MenuElement
# from SmartHome.schemas.auth import Login, ResponseLogin, TokenData, Tokens
# from SmartHome import settings

# logger = logging.getLogger(__name__)

# async def login(data: Login)->FunctionRespons:
#     try:
#         logger.debug(f"login input data: {data.dict()}")
#         u = await User.objects.get_or_none(UserName=data.name)
#         if not u:
#             logger.error(f"user not found")
#             return FunctionRespons(status=TypeRespons.ERROR, detail="user not found")
#         if bcrypt.checkpw(data.password.encode('utf-8'),u.UserPassword.encode('utf-8')):
#             encoded_jwt = await create_tokens(u.id)
#             result = ResponseLogin(token=encoded_jwt.access, userId=u.id, userLevel=u.UserLevel, expires_at=encoded_jwt.expires_at)
#             logger.info(f"login user: {u.UserName}, id: {u.id}")
#             return FunctionRespons(status=TypeRespons.OK, data={"refresh":encoded_jwt.refresh, "response": result})
#         return FunctionRespons(status=TypeRespons.ERROR, detail="invalid data")
#     except Exception as e:
#         logger.error(f"user does not exist. detail: {e}")
#         return FunctionRespons(status=TypeRespons.ERROR, detail=e)

# async def create_tokens(user_id:int)->Tokens:
# 	access_toket_expire = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
# 	refresh_toket_expire = timedelta(minutes=settings.REFRESH_TOKEN_EXPIRE_MINUTES)
# 	access_toket_expires_at = datetime.now(settings.TIMEZONE) + access_toket_expire
# 	refresh_toket_expires_at = datetime.now(settings.TIMEZONE) + refresh_toket_expire
# 	return Tokens(
# 		access = await create_token(
# 			data = {'user_id':user_id,},
# 			expires_at = access_toket_expires_at,
# 			type = "access",
# 			secret = settings.SECRET_JWT_KEY
# 		),
# 		refresh = await create_token(
# 			data = {'user_id':user_id,},
# 			expires_at = refresh_toket_expires_at,
# 			type = "refresh",
# 			secret = settings.SECRET_REFRESH_JWT_KEY
# 		),
# 		expires_at = access_toket_expires_at
# 	)

# async def create_token(data: dict, expires_at: datetime = datetime.now(settings.TIMEZONE) + timedelta(minutes=15), type: str = "access", secret: str = settings.SECRET_JWT_KEY):
# 	to_encode = data.copy()
# 	to_encode.update({'exp': expires_at, 'sub': type})
# 	encoded_jwt = jwt.encode(to_encode, secret, algorithm = settings.ALGORITHM)
# 	return encoded_jwt

# async def auth(Authorization)->FunctionRespons:
# 	try:
# 		head = Authorization
# 		jwtdata = head
# 		jwtdata = head.split(" ")[1]
# 		data = jwt.decode(jwtdata,settings.SECRET_JWT_KEY,algorithms=[settings.ALGORITHM])
# 		if not('exp' in data and 'user_id' in data and data['sub'] == "access"):
# 			logger.worning(f"no data in jwt")
# 			return FunctionRespons(status = TypeRespons.ERROR, detail="no data in jwt")
# 		if (datetime.now(settings.TIMEZONE) > datetime.fromtimestamp(data['exp'], settings.TIMEZONE)):
# 			logger.debug(f"outdated jwt")
# 			return FunctionRespons(status = TypeRespons.INVALID, detail="outdated_jwt")
# 		user = await User.objects.get(id=data['user_id'])
# 		logger.info(f"the user is logged in. id:{data['user_id']}")
# 		return FunctionRespons(status = TypeRespons.OK, data = TokenData(user_id = data['user_id'], user_level = user.level))
# 	except ExpiredSignatureError as e:
# 		return FunctionRespons(status = TypeRespons.INVALID, detail = f"outdated_jwt {e}")
# 	except Exception as e:
# 		return FunctionRespons(status = TypeRespons.ERROR, detail = str(e))

# async def refresh_token(token: str):
#     try:
#         data = jwt.decode(token,settings.SECRET_REFRESH_JWT_KEY,algorithms=[settings.ALGORITHM])
#         if not('exp' in data and 'user_id' in data and data['sub'] == "refresh"):
#             logger.worning(f"no data in jwt")
#             return {'type':'error'}
#         if (datetime.utcnow() > datetime.fromtimestamp(data['exp'])):
#             logger.debug(f"outdated jwt")
#             return {'type':'outdated_jwt'}
#         u = await User.objects.get_or_none(id=data["user_id"])
#         encoded_jwt = await create_tokens(u.id)
#         result = {"token":encoded_jwt.access, "userId":u.id,"userLavel":u.UserLevel}
#         logger.info(f"login user: {u.UserName}, id: {u.id}")
#         return {"type":"ok","data":{"refresh":encoded_jwt.refresh, "response": result}}
#     except Exception as e:
#         return {'type':'error', 'detail':e}

# async def oauth_login(code: str):
#     try:
#         pass
#     except Exception as e:
#         return {'type':'error', 'detail':e}

# async def login(data: Login)->FunctionRespons:
# 	try:
# 		pass
# 	except Exception as e:
# 		return FunctionRespons(status=TypeRespons.ERROR, detail=str(e))