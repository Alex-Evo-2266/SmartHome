

import asyncio
from datetime import datetime, timedelta
import logging
from os import access
import jwt, bcrypt
from jwt import ExpiredSignatureError
from authtorization.old_token import OldTokens
from authtorization.exceptions import InvalidInputException, TooManyTriesException, UserNotFoundException
from authtorization.schema import Login, Tokens
from authtorization.models import AuthType, Session, User
import settings

logger = logging.getLogger(__name__)

async def create_tokens(user: User)->Tokens:
	if not user:
		raise UserNotFoundException()
	access_toket_expire = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
	refresh_toket_expire = timedelta(minutes=settings.REFRESH_TOKEN_EXPIRE_MINUTES)
	access_toket_expires_at = datetime.now(settings.TIMEZONE) + access_toket_expire
	refresh_toket_expires_at = datetime.now(settings.TIMEZONE) + refresh_toket_expire
	return Tokens(
		access = await create_token(
			data = {'user_id':user.id, "user_role": user.role},
			expires_at = access_toket_expires_at,
			type = "access",
			secret = settings.SECRET_JWT_KEY
		),
		refresh = await create_token(
			data = {'user_id':user.id, "user_role": user.role},
			expires_at = refresh_toket_expires_at,
			type = "refresh",
			secret = settings.SECRET_REFRESH_JWT_KEY
		),
		expires_at = access_toket_expires_at
	)

async def create_token(data: dict, expires_at: datetime = datetime.now(settings.TIMEZONE) + timedelta(minutes=15), type: str = "access", secret: str = settings.SECRET_JWT_KEY):
	to_encode = data.copy()
	to_encode.update({'exp': expires_at, 'sub': type})
	encoded_jwt = jwt.encode(to_encode, secret, algorithm = settings.ALGORITHM)
	return encoded_jwt

async def create_session(user: User)->Session:
	if not user:
		raise UserNotFoundException()
	tokens = await create_tokens(user)
	a_b_tokens = await Session.objects.get_or_none(access = tokens.access)
	r_b_tokens = await Session.objects.get_or_none(refresh = tokens.refresh)
	while r_b_tokens or a_b_tokens:
		tokens = await create_tokens(user)
		a_b_tokens = await Session.objects.get_or_none(access = tokens.access)
		r_b_tokens = await Session.objects.get_or_none(refresh = tokens.refresh)
	session = await Session.objects.create(access=tokens.access, refresh=tokens.refresh, user=user, auth_type=AuthType.LOGIN, expires_at=tokens.expires_at)
	return session

async def get_token(data:Session)->Tokens:
	return Tokens(access=data.access, refresh = data.refresh, expires_at=data.expires_at)

async def create_tokens_oauth(user: User, access:str, refresh:str)->Tokens:
	session = await create_session(user)
	session.auth_type = AuthType.AUTH_SERVICE
	session.access_oauth = access
	session.refresh_oauth = refresh
	await session.update(["auth_type", "access_oauth", "refresh_oauth"])
	tokens = await get_token(session)
	return tokens

async def local_login(login_data:Login)->User:
	user = await User.objects.get_or_none(name=login_data.name)
	if not user:
		raise UserNotFoundException()
	if not bcrypt.checkpw(login_data.password.encode('utf-8'), user.password.encode('utf-8')):
		raise InvalidInputException("invalid login or password")
	return user

async def create_valid_user_name(name: str)->str:
	user = await User.objects.get_or_none(name=name)
	count_name = 0
	while user:
		if count_name > 10000:
			logger.error("too many attempts to create a valid name")
			raise TooManyTriesException("too many attempts to create a valid name")
		new_name = name + str(count_name)
		user = await User.objects.get_or_none(name=new_name)
		count_name = count_name + 1
	return new_name

async def refresh_token(token: str)->Tokens:
	data = jwt.decode(token,settings.SECRET_REFRESH_JWT_KEY,algorithms=[settings.ALGORITHM])
	if not('exp' in data and 'user_id' in data and data['sub'] == "refresh"):
		logger.warning(f"no data in jwt")
		raise InvalidInputException("no data in jwt")
	if (datetime.now(settings.TIMEZONE) > datetime.fromtimestamp(data['exp'], settings.TIMEZONE)):
		logger.debug(f"outdated jwt")
		raise ExpiredSignatureError("outdated jwt")
	u = await User.objects.get_or_none(id=data["user_id"])
	if not u:
		raise UserNotFoundException()
	old_token = await Session.objects.get_or_none(refresh=token)
	encoded_jwt = None
	if (not old_token):
		old_token2 = OldTokens.get_or_none(token)
		if not old_token2:
			raise InvalidInputException("not found token")
		encoded_jwt = Tokens(expires_at=old_token2.expires_at, access=old_token2.new_access, refresh=old_token2.new_refresh)
	else:
		encoded_jwt = await create_tokens(u)
		OldTokens.add(old_token.refresh, old_token.access, encoded_jwt.refresh, encoded_jwt.access, encoded_jwt.expires_at)
		loop = asyncio.get_running_loop()
		loop.create_task(OldTokens.delete_delay(old_token.refresh, 10))
		old_token.access = encoded_jwt.access
		old_token.refresh = encoded_jwt.refresh
		old_token.expires_at = encoded_jwt.expires_at
		await old_token.update(["access", "refresh", "expires_at"])
	logger.info(f"login user: {u.name}, id: {u.id}")
	return encoded_jwt