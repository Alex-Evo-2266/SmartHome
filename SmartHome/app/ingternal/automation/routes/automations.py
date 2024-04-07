
import logging
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from typing import Optional, List, Union
from app.ingternal.authtorization.depends.authtorization import token_dep
from app.ingternal.authtorization.schemas.authtorization import TokenData, UserLevel
from app.ingternal.authtorization.exceptions.user import AccessRightsErrorException
from app.ingternal.automation.CRUD import create_automation, get_automation, get_automations, delete_automation, update_automation, edit_status_automation
from app.ingternal.automation.schemas.automation import AddAutomation, AutomationSchema, PatchStatusTrigger


router = APIRouter(
	prefix="/api/automations",
	tags=["automations"],
	responses={404: {"description": "Not found"}},
)

logger = logging.getLogger(__name__)

@router.post("")
async def add_automation_url(data:AddAutomation, auth_data: TokenData = Depends(token_dep)):
	try:
		if auth_data.user_level != UserLevel.ADMIN:
			raise AccessRightsErrorException()
		await create_automation(data)
		return "ok"
	except Exception as e:
		logger.warning(str(e))
		if str(e) == f"(1062, \"Duplicate entry '{data.name}' for key 'PRIMARY'\")":
			return JSONResponse(status_code=400, content="automation with that name already exists")
		return JSONResponse(status_code=400, content=str(e))
	
@router.get("/{system_name}", response_model=Union[AutomationSchema, None])
async def get_automation_url(system_name: str, get_or_none: bool = False, auth_data: TokenData = Depends(token_dep)):
	try:
		if auth_data.user_level == UserLevel.NONE:
			raise AccessRightsErrorException()
		data = await get_automation(system_name, get_or_none)
		return data
	except Exception as e:
		logger.warning(str(e))
		return JSONResponse(status_code=400, content=str(e))
	
@router.get("", response_model=List[AutomationSchema])
async def get_all_automation_url(auth_data: TokenData = Depends(token_dep)):
	try:
		if auth_data.user_level == UserLevel.NONE:
			raise AccessRightsErrorException()
		data = await get_automations()
		return data
	except Exception as e:
		logger.warning(str(e))
		return JSONResponse(status_code=400, content=str(e))
	
@router.delete("/{system_name}")
async def delete_automation_url(system_name: str, auth_data: TokenData = Depends(token_dep)):
	try:
		if auth_data.user_level != UserLevel.ADMIN:
			raise AccessRightsErrorException()
		await delete_automation(system_name)
		return "ok"
	except Exception as e:
		logger.warning(str(e))
		return JSONResponse(status_code=400, content=str(e))
	
@router.put("/{system_name}")
async def edit_automation_url(system_name: str, data:AutomationSchema, updata_or_create:bool = False, auth_data: TokenData = Depends(token_dep)):
	try:
		if auth_data.user_level != UserLevel.ADMIN:
			raise AccessRightsErrorException()
		await update_automation(system_name, data, updata_or_create)
		return "ok"
	except Exception as e:
		logger.warning(str(e))
		return JSONResponse(status_code=400, content=str(e))
	
@router.patch("/{system_name}")
async def edit_status_automation_url(system_name: str, data:PatchStatusTrigger, auth_data: TokenData = Depends(token_dep)):
	try:
		if auth_data.user_level != UserLevel.ADMIN:
			raise AccessRightsErrorException()
		await edit_status_automation(system_name, data.status)
		return "ok"
	except Exception as e:
		logger.warning(str(e))
		return JSONResponse(status_code=400, content=str(e))