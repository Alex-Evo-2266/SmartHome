import logging
from fastapi import APIRouter, Depends, HTTPException
from typing import List, Union
from app.pkg import auth_privilege_dep

from app.ingternal.device_types.serialize_model.create import create
from app.ingternal.device_types.schemas.add_device_type import AddOrEditDeviceTypeSchema, SetMain
from app.ingternal.device_types.schemas.device_type import DeviceTypeSerializeSchema, DeviceTypeResponseSchema, DeviceTypeSerializeResponseSchema
from app.ingternal.device_types.serialize_model.read import get_all_type_device, get_type_device, get_type_main_device
from app.ingternal.device_types.serialize_model.delete import delete_type_device
from app.ingternal.device_types.serialize_model.update import update_type_device, set_main
from app.ingternal.device_types.serialize_model.get_types import get_all_types as get_types
from app.ingternal.device_types.exceptions.device_type import DeviceTypeNotFound

from app.ingternal.logs import get_base_logger

# Настройка логгера
logger = get_base_logger.get_logger(__name__)

router = APIRouter(
	prefix="/api-devices/device-types",
	tags=["device-type"],
	responses={404: {"description": "Not found"}},
)

@router.post("", status_code=200)
async def add_device_type(data: AddOrEditDeviceTypeSchema, user_id:str=Depends(auth_privilege_dep("device"))):
	"""
	Create or update a device type mapping
	
	- If device type exists: updates it
	- If device type doesn't exist: creates new one
	"""
	try:
		logger.info(f"Processing device type for device: {data.device}")
		await create(data)
		logger.info(f"Successfully processed device type for: {data.device}")
		return {"message": "Device type created successfully"}
		
	except Exception as e:
		logger.error(f"Error processing device type {data.device}: {str(e)}", exc_info=True)
		raise HTTPException(
			status_code=400,
			detail=str(e))
	
@router.put("/{id}", status_code=200)
async def edit_device_type(id: str, data: AddOrEditDeviceTypeSchema, user_id:str=Depends(auth_privilege_dep("device"))):
	"""
	Create or update a device type mapping
	
	- If device type exists: updates it
	- If device type doesn't exist: creates new one
	"""
	try:
		logger.info(f"Processing device type for device: {data.device}")
		await update_type_device(data, id)
		logger.info(f"Successfully processed device type for: {data.device}")
		return {"message": "Device type created successfully"}
		
	except Exception as e:
		logger.error(f"Error processing device type {data.device}: {str(e)}", exc_info=True)
		raise HTTPException(
			status_code=400,
			detail=str(e))
			
@router.get("", response_model=DeviceTypeResponseSchema)
async def get_all_types(user_id:str=Depends(auth_privilege_dep("device"))):
	try:
		device_types = get_types()
		return DeviceTypeResponseSchema(data=device_types)
	except Exception as e:
		raise HTTPException(
			status_code=400,
			detail=str(e))

@router.get("/{system_name}", response_model=DeviceTypeSerializeResponseSchema)
async def get_device_all_types(system_name:str, user_id:str=Depends(auth_privilege_dep("device"))):
	try:
		device_types = await get_type_device(system_name)
		return DeviceTypeSerializeResponseSchema(data=device_types)
	except DeviceTypeNotFound:
		return DeviceTypeSerializeResponseSchema(data=[])
	except Exception as e:
		raise HTTPException(
			status_code=400,
			detail=str(e))
	
@router.get("/{system_name}/main", response_model=Union[DeviceTypeSerializeSchema | None])
async def get_main_device_types(system_name:str, user_id:str=Depends(auth_privilege_dep("device"))):
	try:
		device_types = await get_type_main_device(system_name)
		return device_types
	except DeviceTypeNotFound:
		return None
	except Exception as e:
		raise HTTPException(
			status_code=400,
			detail=str(e))
	
@router.patch("/{system_name}/main")
async def set_main_device_types(system_name:str, data:SetMain, user_id:str=Depends(auth_privilege_dep("device"))):
	try:
		await set_main(system_name, data.id)
		return "ok"
	except DeviceTypeNotFound:
		return None
	except Exception as e:
		raise HTTPException(
			status_code=400,
			detail=str(e))

@router.get("/maps", response_model=DeviceTypeSerializeResponseSchema)
async def get_all_field_map(user_id:str=Depends(auth_privilege_dep("device"))):
	"""Get all device type mappings"""
	try:
		logger.info("Fetching all device type mappings")
		device_types = await get_all_type_device()
		logger.debug(f"Found {len(device_types)} device type mappings")
		return DeviceTypeSerializeResponseSchema(data=device_types)
	except Exception as e:
		logger.error(f"Error fetching device types: {str(e)}", exc_info=True)
		raise HTTPException(
			status_code=400,
			detail=str(e))

@router.delete("/{id}", status_code=200)
async def delete_type_dev(id: str, user_id:str=Depends(auth_privilege_dep("device"))):
	"""Delete device type mapping by device system name"""
	try:
		logger.info(f"Deleting device type id: {id}")
		await delete_type_device(id)
		logger.info(f"Successfully deleted device type for: {id}")
		return {"message": "Device type deleted successfully"}
	except Exception as e:
		logger.error(f"Error deleting device type {id}: {str(e)}", exc_info=True)
		raise HTTPException(
			status_code=400,
			detail=str(e))