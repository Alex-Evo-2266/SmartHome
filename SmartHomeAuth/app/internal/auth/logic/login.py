import bcrypt, logging

from app.internal.user.models.user import User

from app.internal.auth.schemas.auth import Login
from app.internal.auth.exceptions.login import InvalidInputException

logger = logging.getLogger(__name__)

async def login_data_check(login_data:Login)->User:
	user = await User.objects.get_or_none(name=login_data.name)
	if not user:
		raise InvalidInputException()
	if not bcrypt.checkpw(login_data.password.encode('utf-8'), user.password.encode('utf-8')):
		raise InvalidInputException("invalid login or password")
	return user
