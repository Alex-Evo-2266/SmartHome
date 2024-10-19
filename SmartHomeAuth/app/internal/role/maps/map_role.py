
from app.internal.role.models.role import Role
from app.internal.role.schemas.role import RoleResponseSchema
from app.internal.role.maps.map_privilege import map_privilege
from app.internal.role.logic.get_privilege import get_privilege

async def map_role(role:Role):
    privileges = await get_privilege(role)
    privileges_data = [await map_privilege(x) for x in privileges]
    return RoleResponseSchema(id=role.id, role_name=role.role_name, privileges=privileges_data)