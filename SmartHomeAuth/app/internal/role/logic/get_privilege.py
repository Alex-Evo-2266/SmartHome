import logging
from typing import List
from app.internal.role.models.role import Role, Privilege
from app.configuration.settings import BASE_ROLE

logger = logging.getLogger(__name__)
	
async def get_privilege(role: Role)->List[Privilege]:
	try:
		if role.role_name == BASE_ROLE.ADMIN:
			return await get_privilege_all()
		privileges = [await x.load() for x in role.privileges]
		return privileges
	except Exception as e:
		logger.error(f"error get privilege: {e}")
		raise
	
async def get_privilege_all()->List[Privilege]:
	try:
		return await Privilege.objects.all()
	except Exception as e:
		logger.error(f"error get privilege: {e}")
		raise
	
async def get_privilege_by_id(id: str)->Privilege | None:
	try:
		return await Privilege.objects.get_or_none(id=id)
	except Exception as e:
		logger.error(f"error get privilege: {e}")
		raise
	
async def get_privilege_by_privilege(privilege: str)->Privilege | None:
	try:
		return await Privilege.objects.get_or_none(privilege=privilege)
	except Exception as e:
		logger.error(f"error get privilege: {e}")
		raise