

import logging
from turtle import title
from typing import List
from SmartHome.models import MenuElement
from SmartHome.exceptions import InvalidFileStructure, ModelElementNotFound
from SmartHome.schemas.menu import MenuElementsSchema
from authtorization.exceptions import UserNotFoundException
from authtorization.models import User
from SmartHome.logic.utils.file import readYMLFile
from settings import MENU_LIST


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
			iconClass=item["iconClass"]
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
			iconClass=item.iconClass
		))
	return Menulist

async def set_menu(data: List[MenuElementsSchema], user_id:int):
	user = await User.objects.get_or_none(id=user_id)
	if not user:
		raise UserNotFoundException()
	menu_list = await MenuElement.objects.all(user=user)
	for item in menu_list:
		await item.delete()
	for item in data:
		await MenuElement.objects.create(title=item.title, url=item.url, iconClass=item.iconClass, user=user)