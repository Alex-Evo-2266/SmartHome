import jwt, logging
from datetime import datetime, timedelta

from app.configuration import settings

from app.internal.user.exceptions.user import UserNotFoundException
from app.internal.user.models.user import User

from app.internal.auth.schemas.auth import Tokens
from app.internal.auth.exceptions.login import InvalidTempTokenException

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
			data = {'user_id':user.id, "user_role": user.role.id},
			expires_at = access_toket_expires_at,
			type = "access",
			secret = settings.SECRET_JWT_KEY
		),
		refresh = await create_token(
			data = {'user_id':user.id, "user_role": user.role.id},
			expires_at = refresh_toket_expires_at,
			type = "refresh",
			secret = settings.SECRET_REFRESH_JWT_KEY
		),
		expires_at = access_toket_expires_at
	)

async def create_token(data: dict, expires_at: datetime | None = None, type: str = "access", secret: str = settings.SECRET_JWT_KEY, service: str | None = None):
	if expires_at is None:
		expires_at = datetime.now(settings.TIMEZONE) + timedelta(minutes=15)
	to_encode = data.copy()
	to_encode.update({'exp': expires_at, 'sub': type, 'service': service})
	encoded_jwt = jwt.encode(to_encode, secret, algorithm = settings.ALGORITHM)
	return encoded_jwt


async def temp_token_check(token:str):
	data = jwt.decode(token,settings.SECRET_JWT_KEY,algorithms=[settings.ALGORITHM])
	if data.get("sub", "") != "temp_token" or "user_role" not in data or "user_id" not in data:
		raise InvalidTempTokenException()
	return {
		"user_id": data.get("user_id"),
		"user_role": data.get("user_role"),
		"service": data.get("service", None)
	}