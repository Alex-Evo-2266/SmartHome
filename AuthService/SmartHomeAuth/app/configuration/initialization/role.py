from app.internal.role.schemas.role import RoleForm
from app.internal.role.logic.create_role import add_role
from app.internal.role.logic.get_role import get_role
from app.configuration.settings import BASE_ROLE

async def initRole():
    try:
        if not await get_role(BASE_ROLE.ADMIN):
            await add_role(RoleForm(role_name=BASE_ROLE.ADMIN))
    except Exception as e:
        print(str(e))
    try:
        if not await get_role(BASE_ROLE.BASE):
            await add_role(RoleForm(role_name=BASE_ROLE.BASE))
    except Exception as e:
        print(str(e))