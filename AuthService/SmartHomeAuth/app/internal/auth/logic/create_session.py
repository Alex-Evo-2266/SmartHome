
from app.internal.user.models.user import User
from uuid import uuid4
from app.internal.user.exceptions.user import UserNotFoundException

from app.internal.auth.logic.token import create_tokens, create_token
from app.internal.auth.models.auth import Session

from app.internal.auth.logic.get_session import get_session_by_id, get_session_by_refresh_token, get_session_by_token
from app.internal.auth.schemas.enums import TypeSession

from datetime import datetime, timedelta
from app.configuration import settings

async def get_uuid_user():
	uuid = uuid4().hex
	while (await get_session_by_id(uuid) != None):
		uuid = uuid4().hex
	return uuid



async def create_session(user: User, host: str | None)->Session:
	uuid = await get_uuid_user()
	if not user:
		raise UserNotFoundException()
	tokens = await create_tokens(user)
	a_b_tokens = await get_session_by_token(tokens.access)
	r_b_tokens = await get_session_by_refresh_token(tokens.refresh)
	while r_b_tokens or a_b_tokens:
		tokens = await create_tokens(user)
		a_b_tokens = await get_session_by_token(tokens.access)
		r_b_tokens = await get_session_by_refresh_token(tokens.refresh)
	session = await Session.objects.create(
		id=uuid,
		access=tokens.access, 
		refresh=tokens.refresh, 
		user=user, 
		expires_at=tokens.expires_at,
		host=host,
		type=TypeSession.ACCESS_AND_REFRESH
		)
	return session


async def create_session_module(user: User, service: str, host: str | None)->Session:
	uuid = await get_uuid_user()
	if not user:
		raise UserNotFoundException()
	module_toket_expire = timedelta(minutes=settings.MODULE_TOKEN_EXPIRE_MINUTES)
	module_toket_expires_at = datetime.now(settings.TIMEZONE) + module_toket_expire
	token = await create_token(
		data={'user_id':user.id, "user_role": user.role.id}, 
		type="cookies_module_token", 
		secret=settings.SECRET_MODULE_JWT_KEY, 
		service=service, 
		expires_at=module_toket_expires_at
	)
	session = await Session.objects.create(
		id=uuid,
		refresh=token, 
		user=user, 
		service=service,
		expires_at=module_toket_expires_at,
		host=host,
		type=TypeSession.COOKIES
		)
	return session