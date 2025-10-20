import logging
from app.internal.role.logic.get_role import get_role_by_id

logger = logging.getLogger(__name__)

async def delete_role_by_id(id: str):
	try:
		role = await get_role_by_id(id)
		await role.delete()
	except Exception as e:
		logger.error(f"error delete roles: {e}")
		raise