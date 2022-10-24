import logging
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from typing import Optional, List
from SmartHome.schemas.auth import TokenData
from SmartHome.schemas.menu import MenuElementsSchema
from SmartHome.logic.menu import get_added_menu_element, get_menu_list, set_menu

from SmartHome.depends.auth import session, token_dep

logger = logging.getLogger(__name__)

router = APIRouter(
	prefix="/api/menu",
	tags=["menu"],
	responses={404: {"description": "Not found"}},
)

@router.get("/all", response_model=List[MenuElementsSchema])
async def get_menu():
	try:
		res = await get_menu_list()
		return res
	except Exception as e:
		logger.error(e)
		return JSONResponse(status_code=400, content=str(e))

@router.get("", response_model=List[MenuElementsSchema])
async def get_menu(auth_data: TokenData = Depends(token_dep)):
	try:
		res = await get_added_menu_element(auth_data.user_id)
		return res
	except Exception as e:
		logger.error(e)
		return JSONResponse(status_code=400, content=str(e))

@router.put("")
async def get_menu(auth_data: TokenData = Depends(token_dep), data: List[MenuElementsSchema] = [MenuElementsSchema(title="", iconClass="",url="")]):
	try:
		await set_menu(data, auth_data.user_id)
		return "ok"
	except Exception as e:
		logger.error(e)
		return JSONResponse(status_code=400, content=str(e))