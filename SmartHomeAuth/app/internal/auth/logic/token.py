import jwt, logging
from datetime import datetime, timedelta

from app.configuration import settings

from app.internal.user.exceptions.user import UserNotFoundException
from app.internal.user.models.user import User

from app.internal.auth.schemas.auth import Tokens

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

async def create_token(data: dict, expires_at: datetime = datetime.now(settings.TIMEZONE) + timedelta(minutes=15), type: str = "access", secret: str = settings.SECRET_JWT_KEY):
	to_encode = data.copy()
	to_encode.update({'exp': expires_at, 'sub': type})
	encoded_jwt = jwt.encode(to_encode, secret, algorithm = settings.ALGORITHM)
	return encoded_jwt
