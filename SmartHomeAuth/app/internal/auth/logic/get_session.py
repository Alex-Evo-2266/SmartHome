
from app.internal.auth.models.auth import Session
from app.internal.auth.schemas.auth import Tokens
from app.internal.user.models.user import User
from typing import List
from app.internal.auth.schemas.auth import SessionSchema

def maping_session(data:Session):
	return SessionSchema(
		id=data.id,
		service=data.service,
		expires_at=data.expires_at,
		host=data.host
	)

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

async def get_sessions_user(user:User)->List[Session]:
	data = await Session.objects.filter(user=user).order_by('expires_at').all()
	return [maping_session(x) for x in data]