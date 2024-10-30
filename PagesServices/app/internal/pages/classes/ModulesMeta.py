from typing import List
from ..logic.get_page import get_pages_path
from ..logic.get_dialog import get_dialog_path
from ..logic.get_menu import get_menu_path

class ModulesMeta(type):
	def __new__(cls, clsname, bases, dct, scan_module=True):
		if scan_module:
			pages_path = get_pages_path(dct.get('__module__'))
			if('pages_path' in dct and isinstance(dct['pages_path'], dict)):
				pages_path = {**pages_path, **dct['pages_path']}
			dct['pages_path'] = pages_path

			dialogs_path = get_dialog_path(dct.get('__module__'))
			if('dialogs_path' in dct and isinstance(dct['dialogs_path'], dict)):
				dialogs_path = {**dialogs_path, **dct['dialogs_path']}
			dct['dialogs_path'] = dialogs_path

			menu_path = get_menu_path(dct.get('__module__'))
			if('menu_path' in dct and isinstance(dct['menu_path'], dict)):
				menu_path = {**menu_path, **dct['menu_path']}
			dct['menu_path'] = menu_path


		new_class = super(ModulesMeta, cls).__new__(cls, clsname, bases, dct)
		return new_class