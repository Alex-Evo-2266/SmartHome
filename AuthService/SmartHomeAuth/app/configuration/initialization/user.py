from app.internal.role.logic.get_role import get_role
from app.internal.user.logic.create_user import add_user
from app.internal.user.logic.get_user import get_users_by_role
from app.internal.user.logic.edit_role_user import edit_role
from app.internal.user.schemas.user import UserForm
from app.internal.user.exceptions.user import UserAlreadyExistsException
from app.configuration.settings import BASE_ROLE, ADMIN_BASE_LOGIN, ADMIN_BASE_PASSWORD

from app.internal.user.models.user import User

async def initUser():
    admin_role = await get_role(BASE_ROLE.ADMIN)
    if(not admin_role):
        raise Exception("error init admin")
    admin_users = await get_users_by_role(admin_role)
    if len(admin_users) != 0:
        return
    user = await add_user(UserForm(name=ADMIN_BASE_LOGIN, password=ADMIN_BASE_PASSWORD, email=''))
    await edit_role(user, admin_role)