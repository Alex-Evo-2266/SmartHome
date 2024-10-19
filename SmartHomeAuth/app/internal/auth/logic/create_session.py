
from app.internal.user.models.user import User
from uuid import uuid4
from app.internal.user.exceptions.user import UserNotFoundException

from app.internal.auth.logic.token import create_tokens
from app.internal.auth.models.auth import Session

from app.internal.auth.logic.get_session import get_session_by_id, get_session_by_refresh_token, get_session_by_token

async def get_uuid_user():
	uuid = uuid4().hex
	while (await get_session_by_id(uuid) != None):
		uuid = uuid4().hex
	return uuid



async def create_session(user: User)->Session:
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
		)
	return session