import logging
from typing import List
from app.menu.models import MenuElement
from app.menu.schemas import MenuElementsSchema
from app.exceptions.exceptions_user import UserNotFoundException
from app.authtorization.models import User
from app.settings import MENU_LIST

logger = logging.getLogger(__name__)

async def set_menu(data: List[MenuElementsSchema], user_id:int):
	user = await User.objects.get_or_none(id=user_id)
	if not user:
		raise UserNotFoundException()
	menu_list = await MenuElement.objects.all(user=user)
	for item in menu_list:
		await item.delete()
	for item in data:
		await MenuElement.objects.create(title=item.title, url=item.url, icon=item.icon, user=user)