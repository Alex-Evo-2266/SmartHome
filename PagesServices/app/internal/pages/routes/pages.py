import logging
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from typing import List
from app.configuration.settings import ROUTE_PREFIX
from app.internal.pages.serialize.formater import mapComponent
from app.internal.pages.serialize.map_menu import mapMenu
from app.internal.pages.logic.get_page import get_page_data
from app.internal.pages.logic.get_dialog import get_dialogs_data
from app.internal.pages.logic.get_menu import get_all_menu_data
from app.internal.pages.logic.modulesArray import ModulesArray
from app.internal.pages.schemas.components import Page, Dialog, Component, ComponentType
from app.internal.pages.schemas.menu import Menu
from app.internal.pages.schemas.web_constructor import WebConstructorData
from app.internal.pages.schemas.module_data import ModuleData

logger = logging.getLogger(__name__)

logging.basicConfig(
    level=logging.DEBUG,
    format="%(filename)s: %(asctime)s - %(levelname)s - %(message)s"
)

router = APIRouter(
	prefix=f"{ROUTE_PREFIX}/pages",
	tags=["send"],
	responses={404: {"description": "Not found"}},
)

@router.get("/all", response_model=List[ModuleData], response_model_exclude_none=True)
async def allPages():
	try:
		modules_data:List[ModuleData] = []
		modules = ModulesArray.get_all()
		for key, value in modules.items():
			pages = []
			for page in value.pages_path:
				pages.append(page)
			value.pages_path
			modules_data.append(ModuleData(name=key, name_pages=pages))
		return modules_data
	except Exception as e:
		logger.error(e)
		return JSONResponse(status_code=400, content=str(e))

@router.get("/{module}/{page}", response_model=WebConstructorData, response_model_exclude_none=True)
async def send(module: str, page: str):
    logger.info(f"Starting to fetch data for module '{module}' and page '{page}'")
    try:
        module_data = ModulesArray.get(module)
        if not module_data:
            logger.error(f"Module '{module}' not found")
            raise Exception("module not found")

        page_path = module_data.pages_path.get(page)
        if not page_path:
            logger.error(f"Page '{page}' not found in module '{module}'")
            raise Exception("page not found")

        dialogs_path = module_data.dialogs_path or []
        menu_path = module_data.menu_path or []
        logger.debug(f"Module '{module}' has {len(dialogs_path)} dialogs and {len(menu_path)} menu items")

        # Fetch page data
        page_data = get_page_data(page_path)
        logger.debug(f"Fetched page data for '{page}'")
        component: Component = mapComponent(page_data['page'], module_data.formaters or {})
        page_data_serializeble = Page(name=page_data['name'], url=page_data['url'], page=component)

        # Fetch dialogs data
        dialogs_data = get_dialogs_data(dialogs_path)
        dialogs_data_serializeble = []
        for dialog in dialogs_data:
            print("p6000", dialog)
            dialog_components_row = dialog.get("components", None)
            if not dialog_components_row:
                dialogs_data_serializeble.append(Dialog(name=dialog['name'], title=dialog['title'], components=[Component(type=ComponentType.TEXT, name="", value="")]))
                continue
            components: List[Component] = []
            for dialog_components in dialog_components_row:
                component: Component = mapComponent(dialog_components, module_data.formaters or {})
                components.append(component)
            dialogs_data_serializeble.append(Dialog(name=dialog['name'], title=dialog['title'], components=components))
        logger.debug(f"Serialized {len(dialogs_data_serializeble)} dialogs")

        # Fetch menu data
        menu_data = get_all_menu_data(menu_path)
        menu_data_serializeble = []
        for menu in menu_data:
            menu_data_serializeble.append(mapMenu(menu))
        logger.debug(f"Serialized {len(menu_data_serializeble)} menu items")

        logger.info(f"Successfully fetched data for module '{module}' and page '{page}'")
        return WebConstructorData(page=page_data_serializeble, dialogs=dialogs_data_serializeble, menu=menu_data_serializeble)
    except Exception as e:
        logger.error(f"Error fetching data for module '{module}' and page '{page}': {e}", exc_info=True)
        return JSONResponse(status_code=400, content=str(e))

# @router.get("/{module}/{page}", response_model=WebConstructorData, response_model_exclude_none=True)
# async def send(module: str, page: str):
# 	try:
# 		module = ModulesArray.get(module)
# 		if not module:
# 			raise Exception("module not found")
# 		page_path = module.pages_path[page]
# 		if not page_path:
# 			raise Exception("page not found")
# 		dialogs_path = module.dialogs_path or []
# 		menu_path = module.menu_path or []

# 		page_data = get_page_data(page_path)
# 		component:Component = mapComponent(page_data['page'], module.formaters or {})
# 		page_data_serializeble = Page(name=page_data['name'], url=page_data['url'], page=component)

# 		dialogs_data = get_dialogs_data(dialogs_path)
# 		dialogs_data_serializeble = []
# 		for dialog in dialogs_data:
# 			component:Component = mapComponent(dialog['components'], module.formaters or {})
# 			dialogs_data_serializeble.append(Dialog(name=dialog['name'], title=dialog['title'], components=component))

# 		menu_data = get_all_menu_data(menu_path)
# 		menu_data_serializeble = []
# 		for menu in menu_data:
# 			menu_data_serializeble.append(mapMenu(menu))

# 		return WebConstructorData(page=page_data_serializeble, dialogs=dialogs_data_serializeble, menu=menu_data_serializeble)
# 	except Exception as e:
# 		logger.error(e)
# 		return JSONResponse(status_code=400, content=str(e))
