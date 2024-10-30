from pydantic import BaseModel
from typing import List
from .components import Page, Dialog
from .menu import Menu

class WebConstructorData(BaseModel):
	page: Page
	dialogs: List[Dialog]
	menu: List[Menu]