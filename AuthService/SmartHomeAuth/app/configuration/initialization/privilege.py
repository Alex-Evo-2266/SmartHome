from app.internal.role.schemas.role import PrivilegeForm
from app.internal.role.logic.create_privilege import add_privilege
from app.internal.role.logic.get_privilege import get_privilege_by_privilege
from app.configuration.settings import BASE_PRIVILEGE_NAME

privieges = [
    "user.add",
    "user.edit",
    "user.editrole",
    "user.delete",
    "role.edit",
    BASE_PRIVILEGE_NAME
]

async def initPriviege():
    for priv in privieges:
        try:
            if not await get_privilege_by_privilege(priv):
                await add_privilege(PrivilegeForm(privilege=priv))
        except Exception as e:
            print(str(e))