import logging
from fastapi import APIRouter
from ..logic.get_page import get_pages_path
from ..logic.get_dialog import get_dialog_path
from ..logic.get_menu import get_menu_path
from ..logic.get_router import get_routers

logger = logging.getLogger(__name__)

def router_create(__module__: str, clsname: str):
	router = APIRouter(
		prefix=f"/{clsname}",
		responses={404: {"description": "Not found"}},
	)

	routers = get_routers(__module__)
	for r in routers:
		if isinstance(r.router, APIRouter):
			router.include_router(r.router)
	
	return router

class ModulesMeta(type):
	def __new__(cls, clsname, bases, dct, scan_module=True):
		if scan_module:
			name:str = dct.get('__module__')
			name_s = name.split('.')
			name = name_s[-1]

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

			router = router_create(dct.get('__module__'), name)
			if('router' in dct and isinstance(dct['router'], APIRouter)):
				router.include_router(dct['router'])
			dct['router'] = router

		new_class = super(ModulesMeta, cls).__new__(cls, clsname, bases, dct)
		return new_class
