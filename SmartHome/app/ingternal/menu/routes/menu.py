import logging
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from typing import Optional, List
from app.ingternal.authtorization.models.user import User
from app.ingternal.authtorization.schemas.user import UserLevel
from app.ingternal.authtorization.schemas.authtorization import TokenData
from app.ingternal.menu.schemas.menu import MenuElementsSchema
from app.ingternal.menu.get_menu import get_added_menu_element, get_menu_list
from app.ingternal.menu.set_menu import set_menu

from app.ingternal.authtorization.depends.authtorization import session, token_dep, token_dep_all_user

logger = logging.getLogger(__name__)

router = APIRouter(
	prefix="/api/users/menu",
	tags=["menu"],
	responses={404: {"description": "Not found"}},
)

@router.get("/all", response_model=List[MenuElementsSchema])
async def get_all_menu(auth_data: TokenData = Depends(token_dep_all_user)):
	try:
		res = await get_menu_list()
		return res
	except Exception as e:
		logger.error(e)
		return JSONResponse(status_code=400, content=str(e))

@router.get("", response_model=List[MenuElementsSchema])
async def get_menu(auth_data: TokenData = Depends(token_dep_all_user)):
	try:
		user = await User.objects.get_or_none(id=auth_data.user_id)
		if user.role == UserLevel.NONE:
			return list()
		res = await get_added_menu_element(auth_data.user_id)
		return res
	except Exception as e:
		logger.error(e)
		return JSONResponse(status_code=400, content=str(e))

@router.put("")
async def put_menu(auth_data: TokenData = Depends(token_dep), data: List[MenuElementsSchema] = [MenuElementsSchema(title="", iconClass="",url="", icon="")]):
	try:
		await set_menu(data, auth_data.user_id)
		return "ok"
	except Exception as e:
		logger.error(e)
		return JSONResponse(status_code=400, content=str(e))