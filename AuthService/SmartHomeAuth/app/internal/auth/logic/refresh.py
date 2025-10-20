import jwt, logging, asyncio
from jwt import ExpiredSignatureError
from datetime import datetime
from app.configuration import settings
from app.internal.exceptions.base import InvalidInputException

from app.internal.user.models.user import User
from app.internal.user.exceptions.user import UserNotFoundException


from app.internal.auth.schemas.auth import Tokens
from app.internal.auth.models.auth import Session
from app.internal.auth.logic.old_token import OldTokens
from app.internal.auth.logic.token import create_tokens

logger = logging.getLogger(__name__)

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