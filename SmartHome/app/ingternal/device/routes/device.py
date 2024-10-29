import logging
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from typing import Optional, List
from app.pkg.auth.depends.auth import auth_privilege_dep
from app.ingternal.device.schemas.device import AddDeviceSchema, EditDeviceSchema, DeviceSchema
from app.ingternal.device.CRUD.create import add_device
from app.ingternal.device.CRUD.delete import delete_device
from app.ingternal.device.CRUD.update import edit_device
from app.ingternal.device.CRUD.read import get_device, get_all_device
from app.ingternal.device.options.options import get_option, OptionsDevice
from app.ingternal.device.set_value import set_value
from app.ingternal.device.schemas.device import ConsctionStatusForm
from app.ingternal.device.device_data.polling import device_polling_edit
from app.configuration.settings import ROUTE_PREFIX


router = APIRouter(
	prefix=f"{ROUTE_PREFIX}/devices",
	tags=["device"],
	responses={404: {"description": "Not found"}},
)

logger = logging.getLogger(__name__)

@router.post("")
async def add_device_url(data:AddDeviceSchema, user_id: str = Depends(auth_privilege_dep('device_admin'))):
	try:
		await add_device(data)
		return "ok"
	except Exception as e:
		logger.warning(str(e))
		if str(e) == f"(1062, \"Duplicate entry '{data.system_name}' for key 'PRIMARY'\")":
			return JSONResponse(status_code=400, content="device with that name already exists")
		return JSONResponse(status_code=400, content=str(e))
	
@router.put("/{system_name}")
async def edit_dev(system_name:str, data:EditDeviceSchema, user_id: str = Depends(auth_privilege_dep('device_admin'))):
	try:
		await edit_device(system_name, data)
		return "ok"
	except Exception as e:
		logger.warning(str(e))
		return JSONResponse(status_code=400, content=str(e))
	
@router.delete("/{system_name}")
async def delete_dev(system_name:str, user_id: str = Depends(auth_privilege_dep('device_admin'))):
	try:
		await delete_device(system_name)
		return "ok"
	except Exception as e:
		logger.warning(str(e))
		return JSONResponse(status_code=400, content=str(e))
	
@router.get("/options", response_model=List[OptionsDevice])
async def get_options_dev(user_id: str = Depends(auth_privilege_dep('device_admin'))):
	try:
		data = get_option()
		print(data)
		return data
	except Exception as e:
		logger.warning(str(e))
		return JSONResponse(status_code=400, content=str(e))
	
@router.get("/{system_name}", response_model=DeviceSchema)
async def get_dev(system_name:str, user_id: str = Depends(auth_privilege_dep('device'))):
	try:
		data = get_device(system_name)
		return data
	except Exception as e:
		logger.warning(str(e))
		return JSONResponse(status_code=400, content=str(e))
	
@router.get("", response_model=List[DeviceSchema])
async def get_all_dev(user_id: str = Depends(auth_privilege_dep('device'))):
	try:
		data = await get_all_device()
		return data
	except Exception as e:
		logger.warning(str(e))
		return JSONResponse(status_code=400, content=str(e))
	

@router.get("/{system_name}/value/{field_name}/set/{value}")
async def set_device_state(system_name, field_name, value, user_id: str = Depends(auth_privilege_dep('device'))):
	try:
		set_value(system_name, field_name, value)
	except Exception as e:
		logger.warning(str(e))
		return JSONResponse(status_code=400, content=str(e))

	
@router.post("/{system_name}/polling")
async def set_connection_status(system_name, data:ConsctionStatusForm, user_id: str = Depends(auth_privilege_dep('device'))):
	try:
		await device_polling_edit(system_name, data.status)
		return "ok"
	except Exception as e:
		logger.warning(str(e))
		return JSONResponse(status_code=400, content=str(e))