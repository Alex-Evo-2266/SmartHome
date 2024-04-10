
import logging
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from typing import Optional, List
from app.ingternal.authtorization.depends.authtorization import token_dep
from app.ingternal.authtorization.schemas.authtorization import TokenData, UserLevel
from app.ingternal.authtorization.exceptions.user import AccessRightsErrorException
from app.ingternal.scripts.CRUD.create import create_script
from app.ingternal.scripts.CRUD.read import get_scripts, get_all_scripts
from app.ingternal.scripts.CRUD.update import updata_script
from app.ingternal.scripts.CRUD.delete import delete_script
from app.ingternal.scripts.runing.run import run_script
from app.ingternal.scripts.schemas.script_block import Script
from app.configuration.settings import SCRIPTS_DIR

import os


router = APIRouter(
	prefix="/api/scripts",
	tags=["scripts"],
	responses={404: {"description": "Not found"}},
)

logger = logging.getLogger(__name__)

@router.get("/{system_name}/start")
async def get_script_url(system_name: str, auth_data: TokenData = Depends(token_dep)):
	try:
		if auth_data.user_level == UserLevel.NONE:
			raise AccessRightsErrorException()
		await run_script(system_name)
	except Exception as e:
		logger.warning(str(e))
		return JSONResponse(status_code=400, content=str(e))

@router.post("")
async def add_script_url(data:Script, auth_data: TokenData = Depends(token_dep)):
	try:
		if auth_data.user_level != UserLevel.ADMIN:
			raise AccessRightsErrorException()
		await create_script(data)
		return "ok"
	except Exception as e:
		logger.warning(str(e))
		if str(e) == f"(1062, \"Duplicate entry '{data.name}' for key 'PRIMARY'\")":
			return JSONResponse(status_code=400, content="automation with that name already exists")
		return JSONResponse(status_code=400, content=str(e))
	
@router.get("/{system_name}", response_model=Script)
async def get_script_url(system_name: str, auth_data: TokenData = Depends(token_dep)):
	try:
		if auth_data.user_level == UserLevel.NONE:
			raise AccessRightsErrorException()
		data = await get_scripts(os.path.join(SCRIPTS_DIR, system_name + ".yml"))
		return data
	except Exception as e:
		logger.warning(str(e))
		return JSONResponse(status_code=400, content=str(e))
	
@router.get("", response_model=List[Script])
async def get_all_script_url(auth_data: TokenData = Depends(token_dep)):
	try:
		if auth_data.user_level == UserLevel.NONE:
			raise AccessRightsErrorException()
		data = await get_all_scripts()
		return data
	except Exception as e:
		logger.warning(str(e))
		return JSONResponse(status_code=400, content=str(e))
	
@router.delete("/{system_name}")
async def delete_automation_url(system_name: str, auth_data: TokenData = Depends(token_dep)):
	try:
		if auth_data.user_level != UserLevel.ADMIN:
			raise AccessRightsErrorException()
		await delete_script(system_name)
		return "ok"
	except Exception as e:
		logger.warning(str(e))
		return JSONResponse(status_code=400, content=str(e))
	
@router.put("/{system_name}")
async def edit_automation_url(system_name: str, data:Script, auth_data: TokenData = Depends(token_dep)):
	try:
		if auth_data.user_level != UserLevel.ADMIN:
			raise AccessRightsErrorException()
		await updata_script(system_name, data)
		return "ok"
	except Exception as e:
		logger.warning(str(e))
		return JSONResponse(status_code=400, content=str(e))
	