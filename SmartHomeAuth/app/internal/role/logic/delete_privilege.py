from app.internal.role.models.role import Privilege
import logging
from app.internal.role.logic.get_privilege import get_privilege, get_privilege_by_id

logger = logging.getLogger(__name__)

async def delete_privilege(privilege: str):
	try:
		privilege = await get_privilege(privilege)
		await privilege.delete()
	except Exception as e:
		logger.error(f"error get roles: {e}")
		raise
	
async def delete_privilege_by_id(id: str):
	try:
		privilege = await get_privilege_by_id(id)
		await privilege.delete()
	except Exception as e:
		logger.error(f"error get roles: {e}")
		raise