import logging
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from app.configuration.settings import ROUTE_PREFIX
from app.internal.pages.logic.formater import mapComponent
from app.internal.pages.logic.get_page import get_page_data
from app.internal.pages.logic.modulesArray import ModulesArray
from app.internal.pages.schemas.components import Component

logger = logging.getLogger(__name__)

router = APIRouter(
	prefix=f"{ROUTE_PREFIX}/pages",
	tags=["send"],
	responses={404: {"description": "Not found"}},
)

@router.get("/{module}/{page}", response_model=Component, response_model_exclude_none=True)
async def send(module: str, page: str):
	try:
		module = ModulesArray.get(module)
		if not module:
			raise Exception("module not found")
		page_path = module.pages_path[page]
		if not page_path:
			raise Exception("page not found")
		component:Component = mapComponent(get_page_data(page_path), module.formaters or {})
		return component
	except Exception as e:
		logger.error(e)
		return JSONResponse(status_code=400, content=str(e))
