import logging
from typing import List
from app.authtorization.models import User
from app.menu.models import MenuElement
from app.exceptions.exceptions import InvalidFileStructure, ModelElementNotFound
from app.menu.schemas import MenuElementsSchema
from app.exceptions.exceptions_user import UserNotFoundException
from app.utils.file import readYMLFile
from app.settings import MENU_LIST


logger = logging.getLogger(__name__)

async def get_menu_list()->List[MenuElementsSchema]:
	menu_list = readYMLFile(MENU_LIST)
	arr = []
	for item in menu_list:
		if (not "title" in item) or (not "url" in item) or (not "iconClass" in item):
			raise InvalidFileStructure("invalid menu file structure")
		arr.append(MenuElementsSchema(
			title=item["title"],
			url=item["url"],
			iconClass=item["iconClass"],
			icon=item["icon"]
		))
	return arr

async def get_added_menu_element(user_id: int)->List[MenuElementsSchema]:
	user = await User.objects.get_or_none(id=user_id)
	if not user:
		logger.error(f"none user")
		raise UserNotFoundException()
	menu = await MenuElement.objects.all(user=user)
	if menu == None:
		logger.error(f"menu not found")
		raise ModelElementNotFound()
	Menulist = list()
	for item in menu:
		Menulist.append(MenuElementsSchema(
			id=item.id,
			title=item.title,
			url=item.url,
			iconClass=item.iconClass,
			icon=item.icon
		))
	return Menulist