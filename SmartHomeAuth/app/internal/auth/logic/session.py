
from app.internal.user.models.user import User
from app.internal.user.exceptions.user import UserNotFoundException

from app.internal.auth.logic.token import create_tokens
from app.internal.auth.models.auth import Session
from app.internal.auth.schemas.auth import Tokens


async def get_token(data:Session)->Tokens:
	return Tokens(access=data.access, refresh = data.refresh, expires_at=data.expires_at)

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
	session = await Session.objects.create(
		access=tokens.access, 
		refresh=tokens.refresh, 
		user=user, 
		expires_at=tokens.expires_at,
		)
	return session