import logging

from app.internal.user.models.user import User
from app.internal.auth.logic.get_session import get_session_by_id

logger = logging.getLogger(__name__)

async def delete_session_user(id:str, user: User):
	session = await get_session_by_id(id)
	if not session:
		logger.error(f"none session")
		raise Exception("session not found")
	if(session.user == user):
		await session.delete()
		return
	raise Exception("session not user")

async def delete_session(id:str):
	session = await get_session_by_id(id)
	if not session:
		logger.error(f"none session")
		raise Exception("session not found")
	await session.delete()