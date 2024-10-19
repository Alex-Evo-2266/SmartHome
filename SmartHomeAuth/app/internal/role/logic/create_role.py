import logging
from uuid import uuid4
from app.internal.role.schemas.role import RoleForm
from app.internal.role.exceptions.role import RoleAlreadyExistsException
from app.internal.user.models.user import Role
from app.internal.role.logic.get_role import get_role_by_id

logger = logging.getLogger(__name__)

async def get_uuid_user():
	uuid = uuid4().hex
	while (await get_role_by_id(uuid) != None):
		uuid = uuid4().hex
	return uuid

async def add_role(data: RoleForm):
	try:
		uuid = await get_uuid_user()
		logger.debug(f"add role input data: {data.dict()}")
		cond = await Role.objects.create(id=uuid, role_name=data.role_name)
		if(cond):
			raise RoleAlreadyExistsException('such role already exists')
	except Exception as e:
		logger.error(f"error add role: {e}")
		raise
	
