from async_lru import alru_cache
import logging
from typing import List
from app.internal.role.models.role import Role, Privilege
from app.configuration.settings import BASE_ROLE
from app.internal.role.logic.get_role import get_role_by_id

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

@alru_cache(maxsize=1000)
async def get_privilege_by_role_id(role_id: str)->List[Privilege]:
	try:
		role = await get_role_by_id(role_id)
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