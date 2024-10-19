
from app.internal.auth.models.auth import Session
from app.internal.auth.schemas.auth import Tokens
from app.internal.user.models.user import User

async def get_token(data:Session)->Tokens:
	return Tokens(access=data.access, refresh = data.refresh, expires_at=data.expires_at)

async def get_session_by_id(id:str)->Session | None:
	return await Session.objects.get_or_none(id = id)

async def get_session_by_token(token:str)->Session | None:
	return await Session.objects.get_or_none(access=token)

async def get_session_by_refresh_token(refresh_token:str)->Session | None:
	return await Session.objects.get_or_none(refresh=refresh_token)

async def get_session_user(user:User)->Session | None:
	return await Session.objects.get_or_none(user=user)