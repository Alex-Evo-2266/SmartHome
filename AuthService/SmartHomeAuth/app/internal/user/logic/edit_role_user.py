import logging

from app.internal.role.models.role import Role
from app.internal.user.models.user import User

logger = logging.getLogger(__name__)

async def edit_role(user: User, role: Role):
	user.role = role
	await user.update(_columns=["role"])
	logger.debug(f'edit level user {user.id}')