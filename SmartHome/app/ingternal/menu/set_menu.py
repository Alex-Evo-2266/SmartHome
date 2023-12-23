import logging
from typing import List
from app.ingternal.menu.models.menu import MenuElement
from app.ingternal.menu.schemas.menu import MenuElementsSchema
from app.ingternal.authtorization.exceptions.user import UserNotFoundException
from app.pkg.ormar.models import User

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