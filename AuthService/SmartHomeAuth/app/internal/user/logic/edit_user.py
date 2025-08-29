import logging, bcrypt

from app.internal.user.models.user import User
from app.internal.auth.exceptions.login import InvalidInputException

from app.internal.user.schemas.user import UserEditSchema, UserEditPasswordSchema

logger = logging.getLogger(__name__)

async def edit_user(user: User, new_data:UserEditSchema):
	user.email = new_data.email
	user.name = new_data.name
	await user.update(_columns=["email", "name"])
	logger.debug(f'edit user {user.id}')
	
async def edit_user_password(user: User, new_data:UserEditPasswordSchema):
	if not bcrypt.checkpw(new_data.old_password .encode('utf-8'), user.password.encode('utf-8')):
		raise InvalidInputException("invalid login or password")
	hashedPass = bcrypt.hashpw(new_data.new_password.encode('utf-8'), bcrypt.gensalt())
	user.password = hashedPass
	await user.update(_columns=["password"])
	logger.debug(f'edit password user {user.id}')