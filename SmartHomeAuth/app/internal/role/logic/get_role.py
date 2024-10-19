import logging
from app.internal.role.models.role import Role

logger = logging.getLogger(__name__)

async def get_role(name: str)->Role | None:
	try:
		return await Role.objects.get_or_none(role_name=name)
	except Exception as e:
		logger.error(f"error get role: {e}")
		raise
	
async def get_role_by_id(id: str)->Role | None:
	try:
		return await Role.objects.get_or_none(id=id)
	except Exception as e:
		logger.error(f"error get role: {e}")
		raise
	
