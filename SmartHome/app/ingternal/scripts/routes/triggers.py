
import logging
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from typing import Optional, List
from app.ingternal.authtorization.depends.authtorization import token_dep
from app.ingternal.authtorization.schemas.authtorization import TokenData, UserLevel
from app.ingternal.authtorization.exceptions.user import AccessRightsErrorException
from app.ingternal.scripts.CRUD import create_trigger, get_trigger, get_triggers, delete_trigger, update_trigger, edit_status_trigger
from app.ingternal.scripts.schemas.trigger import AddTrigger, TriggerSchema, PatchStatusTrigger


router = APIRouter(
	prefix="/api/scripts",
	tags=["scripts"],
	responses={404: {"description": "Not found"}},
)

logger = logging.getLogger(__name__)

@router.post("/triggers")
async def add_trigger_url(data:AddTrigger, auth_data: TokenData = Depends(token_dep)):
	try:
		if auth_data.user_level != UserLevel.ADMIN:
			raise AccessRightsErrorException()
		await create_trigger(data)
		return "ok"
	except Exception as e:
		logger.warning(str(e))
		if str(e) == f"(1062, \"Duplicate entry '{data.name}' for key 'PRIMARY'\")":
			return JSONResponse(status_code=400, content="trigger with that name already exists")
		return JSONResponse(status_code=400, content=str(e))
	
@router.get("/triggers/{system_name}", response_model=TriggerSchema)
async def get_trigger_url(system_name: str, auth_data: TokenData = Depends(token_dep)):
	try:
		if auth_data.user_level == UserLevel.NONE:
			raise AccessRightsErrorException()
		data = await get_trigger(system_name)
		return data
	except Exception as e:
		logger.warning(str(e))
		return JSONResponse(status_code=400, content=str(e))
	
@router.get("/triggers", response_model=List[TriggerSchema])
async def get_all_trigger_url(auth_data: TokenData = Depends(token_dep)):
	try:
		if auth_data.user_level == UserLevel.NONE:
			raise AccessRightsErrorException()
		data = await get_triggers()
		return data
	except Exception as e:
		logger.warning(str(e))
		return JSONResponse(status_code=400, content=str(e))
	
@router.delete("/triggers/{system_name}")
async def delete_trigger_url(system_name: str, auth_data: TokenData = Depends(token_dep)):
	try:
		if auth_data.user_level != UserLevel.ADMIN:
			raise AccessRightsErrorException()
		await delete_trigger(system_name)
		return "ok"
	except Exception as e:
		logger.warning(str(e))
		return JSONResponse(status_code=400, content=str(e))
	
@router.put("/triggers/{system_name}")
async def edit_trigger_url(system_name: str, data:TriggerSchema, auth_data: TokenData = Depends(token_dep)):
	try:
		if auth_data.user_level != UserLevel.ADMIN:
			raise AccessRightsErrorException()
		await update_trigger(system_name, data)
		return "ok"
	except Exception as e:
		logger.warning(str(e))
		return JSONResponse(status_code=400, content=str(e))
	
@router.patch("/triggers/{system_name}")
async def edit_status_trigger_url(system_name: str, data:PatchStatusTrigger, auth_data: TokenData = Depends(token_dep)):
	try:
		if auth_data.user_level != UserLevel.ADMIN:
			raise AccessRightsErrorException()
		await edit_status_trigger(system_name, data.status)
		return "ok"
	except Exception as e:
		logger.warning(str(e))
		return JSONResponse(status_code=400, content=str(e))