
from app.internal.role.models.role import Privilege
from app.internal.role.schemas.role import PrivilegeSchema

async def map_privilege(privilege:Privilege):
    return PrivilegeSchema(id=privilege.id, privilege=privilege.privilege)