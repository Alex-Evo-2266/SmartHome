import logging
from app.internal.user.exceptions.user import UserNotFoundException
from app.internal.user.logic.get_user import get_user

from app.internal.email.send_email import send_email

logger = logging.getLogger(__name__)

async def delete_user(id:str):
	user = await get_user(id)
	if not user:
		logger.error(f"none user")
		raise UserNotFoundException()
	message = "Account deleted name = " + user.name
	await send_email("Account smart home", user.email, message)
	logger.info(f"user delete. id:{id}. user name:{user.name}")
	await user.delete()