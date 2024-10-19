import logging
from uuid import uuid4
from app.internal.role.schemas.role import PrivilegeForm
from app.internal.role.exceptions.role import RoleAlreadyExistsException
from app.internal.role.models.role import Privilege
from app.internal.role.logic.get_privilege import get_privilege_by_id

logger = logging.getLogger(__name__)

async def get_uuid_user():
	uuid = uuid4().hex
	while (await get_privilege_by_id(uuid) != None):
		uuid = uuid4().hex
	return uuid

async def add_privilege(data: PrivilegeForm):
	try:
		uuid = await get_uuid_user()
		logger.debug(f"add role input data: {data.dict()}")
		cond = await Privilege.objects.create(id=uuid, privilege=data.privilege)
		if(cond):
			raise RoleAlreadyExistsException('such role already exists')
	except Exception as e:
		logger.error(f"error add role: {e}")
		raise
	
