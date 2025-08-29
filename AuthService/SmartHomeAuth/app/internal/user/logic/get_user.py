import logging
from app.internal.user.models.user import User
from app.internal.role.models.role import Role
from typing import Optional, List

logger = logging.getLogger(__name__)

async def get_user(id: str)->User | None:
	try:
		return await User.objects.get_or_none(id=id)
	except Exception as e:
		logger.error(f"error get user: {e}")
		raise
	
async def get_user_by_name(name: str)->User | None:
	try:
		return await User.objects.get_or_none(name=name)
	except Exception as e:
		logger.error(f"error get user: {e}")
		raise
	
async def get_users_by_role(role: Role)->List[User]:
	try:
		return await User.objects.all(role=role)
	except Exception as e:
		logger.error(f"error get user: {e}")
		raise
	
async def get_all_users()->List[User]:
	try:
		return await User.objects.all()
	except Exception as e:
		logger.error(f"error get all users: {e}")
		raise
	