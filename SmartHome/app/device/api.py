import logging
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from typing import Optional, List
from app.authtorization.auth_depends import token_dep
from app.authtorization.schema import TokenData, UserLevel
from app.device.schemas import AddDeviceSchema, EditDeviceSchema, DeviceSchema
from app.device.CRUD import add_device, edit_device, delete_device, get_device, get_all_device
from app.exceptions.exceptions_user import AccessRightsErrorException


router = APIRouter(
	prefix="/api/devices",
	tags=["device"],
	responses={404: {"description": "Not found"}},
)

logger = logging.getLogger(__name__)

# @router.post("")
# async def add_device_url(data:AddDeviceSchema, auth_data: TokenData = Depends(token_dep)):

@router.post("")
async def add_device_url(data:AddDeviceSchema):
	try:
		# if auth_data.user_level != UserLevel.ADMIN:
		# 	raise AccessRightsErrorException()
		await add_device(data)
		return "ok"
	except Exception as e:
		logger.warning(str(e))
		return JSONResponse(status_code=400, content=str(e))
	
@router.put("/{system_name}")
async def edit_dev(system_name:str, data:EditDeviceSchema):
	try:
		# if auth_data.user_level != UserLevel.ADMIN:
		# 	raise AccessRightsErrorException()
		await edit_device(system_name, data)
		return "ok"
	except Exception as e:
		logger.warning(str(e))
		return JSONResponse(status_code=400, content=str(e))
	
@router.delete("/{system_name}")
async def delete_dev(system_name:str):
	try:
		# if auth_data.user_level != UserLevel.ADMIN:
		# 	raise AccessRightsErrorException()
		await delete_device(system_name)
		return "ok"
	except Exception as e:
		logger.warning(str(e))
		return JSONResponse(status_code=400, content=str(e))
	
@router.get("/{system_name}", response_model=DeviceSchema)
async def get_dev(system_name:str):
	try:
		# if auth_data.user_level != UserLevel.ADMIN:
		# 	raise AccessRightsErrorException()
		data = get_device(system_name)
		return data
	except Exception as e:
		logger.warning(str(e))
		return JSONResponse(status_code=400, content=str(e))
	
@router.get("", response_model=List[DeviceSchema])
async def get_all_dev():
	try:
		# if auth_data.user_level != UserLevel.ADMIN:
		# 	raise AccessRightsErrorException()
		data = await get_all_device()
		return data
	except Exception as e:
		logger.warning(str(e))
		return JSONResponse(status_code=400, content=str(e))