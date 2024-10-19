import logging

from app.internal.role.models.role import Role
from app.internal.user.models.user import User
from app.internal.role.schemas.role import EditPrivilegeRoleForm
from app.internal.role.logic.get_role import get_role
from app.internal.role.logic.get_privilege import get_privilege_by_privilege
from app.internal.role.exceptions.role import RoleNotFoundException

logger = logging.getLogger(__name__)

async def edit_privilege_role(data: EditPrivilegeRoleForm):
	role = await get_role(data.role_name)
	if not role:
		raise RoleNotFoundException()
	await role.privileges.clear()
	for privilege in data.privileges:
		privilege_item = await get_privilege_by_privilege(privilege.privilege)
		if not privilege_item:
			continue
		await role.privileges.add(privilege_item)
	logger.debug(f'edit privileges role {role.role_name}')