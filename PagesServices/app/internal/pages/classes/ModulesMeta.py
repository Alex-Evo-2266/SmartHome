from typing import List
from ..logic.get_page import get_pages_path

class ModulesMeta(type):
	def __new__(cls, clsname, bases, dct, scan_module=True):
		if scan_module:
			pages_path = get_pages_path(dct.get('__module__'))
			if('pages_path' in dct and isinstance(dct['pages_path'], dict)):
				pages_path = {**pages_path, **dct['pages_path']}
			dct['pages_path'] = pages_path
		new_class = super(ModulesMeta, cls).__new__(cls, clsname, bases, dct)
		return new_class