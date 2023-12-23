import logging
from typing import List
from app.ingternal.authtorization.models.user import User
from app.ingternal.menu.models.menu import MenuElement
from app.ingternal.menu.exeptions.exeptions import InvalidFileStructure, ModelElementNotFound
from app.ingternal.menu.schemas.menu import MenuElementsSchema
from app.ingternal.authtorization.exceptions.user import UserNotFoundException
from app.ingternal.file import readYMLFile
from app.configuration.settings import MENU_LIST


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