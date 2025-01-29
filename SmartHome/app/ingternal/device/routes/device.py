import logging
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from typing import Optional, List, Union
from app.ingternal.device.schemas.device import DeviceSchema, StatusForm, DeviceSerializeSchema
from app.ingternal.device.schemas.add_device import AddDeviceSchema
from app.ingternal.device.schemas.edit_device import EditDeviceSchema
from app.ingternal.device.schemas.config import DeviceClassConfigSchema

from app.ingternal.device.serialize_model.read import get_serialize_device, get_device
from app.ingternal.device.helpers.get_option_device import get_config_devices
from app.ingternal.device.serialize_model.create import add_device
from app.ingternal.device.serialize_model.delete import delete_device

router = APIRouter(
	prefix="/api-devices/devices",
	tags=["device"],
	responses={404: {"description": "Not found"}},
)

logger = logging.getLogger(__name__)

@router.post("")
async def add_device_url(data:AddDeviceSchema):
	try:
		await add_device(data)
		return "ok"
	except Exception as e:
		logger.warning(str(e))
		return JSONResponse(status_code=400, content=str(e))
	
@router.put("/{system_name}")
async def edit_dev(system_name:str, data:EditDeviceSchema):
	try:
		return "ok"
	except Exception as e:
		logger.warning(str(e))
		return JSONResponse(status_code=400, content=str(e))
	
@router.delete("/{system_name}")
async def delete_dev(system_name:str):
	try:
		await delete_device(system_name)
		return "ok"
	except Exception as e:
		logger.warning(str(e))
		return JSONResponse(status_code=400, content=str(e))
	
@router.get("/options", response_model=List[DeviceClassConfigSchema])
async def get_options_dev():
	try:
		options = get_config_devices()
		return options
	except Exception as e:
		logger.warning(str(e))
		return JSONResponse(status_code=400, content=str(e))
	
@router.get("/{system_name}", response_model=DeviceSerializeSchema)
async def get_dev(system_name:str):
	try:
		return await get_device(system_name)
	except Exception as e:
		logger.warning(str(e))
		return JSONResponse(status_code=400, content=str(e))

@router.get("/{system_name}/row", response_model=DeviceSerializeSchema)
async def get_dev(system_name:str):
	try:
		return await get_serialize_device(system_name)
	except Exception as e:
		logger.warning(str(e))
		return JSONResponse(status_code=400, content=str(e))
		
@router.get("", response_model=List[DeviceSchema])
async def get_all_dev():
	try:
		pass
	except Exception as e:
		logger.warning(str(e))
		return JSONResponse(status_code=400, content=str(e))
	

@router.get("/{system_name}/value/{field_name}/set/{value}")
async def set_device_state(system_name, field_name, value):
	try:
		pass
	except Exception as e:
		logger.warning(str(e))
		return JSONResponse(status_code=400, content=str(e))

	
@router.patch("/{system_name}/polling")
async def set_connection_status(system_name, data:StatusForm):
	try:
		return "ok"
	except Exception as e:
		logger.warning(str(e))
		return JSONResponse(status_code=400, content=str(e))