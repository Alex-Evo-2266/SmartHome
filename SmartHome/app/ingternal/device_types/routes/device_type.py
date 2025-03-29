import logging
from fastapi import APIRouter, Depends, HTTPException
from typing import List

from app.ingternal.device_types.serialize_model.create import create
from app.ingternal.device_types.schemas.add_device_type import AddOrEditDeviceTypeSchema
from app.ingternal.device_types.schemas.device_type import DeviceTypeSerializeSchema, DeviceTypeSchema
from app.ingternal.device_types.serialize_model.read import get_all_type_device, get_type_device
from app.ingternal.device_types.serialize_model.delete import delete_type_device_by_device
from app.ingternal.device_types.serialize_model.update import update_type_device
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
async def add_device_type(data: AddOrEditDeviceTypeSchema):
	"""
	Create or update a device type mapping
	
	- If device type exists: updates it
	- If device type doesn't exist: creates new one
	"""
	try:
		logger.info(f"Processing device type for device: {data.device}")
		
		try:
			# Check if exists and update
			await get_type_device(data.device)
			logger.debug(f"Device type exists, updating: {data.device}")
			await update_type_device(data)
			message = "Device type updated successfully"
		except DeviceTypeNotFound:
			# Create new if not exists
			logger.debug(f"Device type not found, creating new: {data.device}")
			await create(data)
			message = "Device type created successfully"
			
		logger.info(f"Successfully processed device type for: {data.device}")
		return {"message": message}
		
	except Exception as e:
		logger.error(f"Error processing device type {data.device}: {str(e)}", exc_info=True)
		raise HTTPException(
			status_code=400,
			detail=str(e))
			
@router.get("/", response_model=List[DeviceTypeSchema])
async def get_all_types():
	try:
		device_types = get_types()
		return device_types
	except Exception as e:
		raise HTTPException(
			status_code=400,
			detail=str(e))

@router.get("/maps", response_model=List[DeviceTypeSerializeSchema])
async def get_all_field_map():
	"""Get all device type mappings"""
	try:
		logger.info("Fetching all device type mappings")
		device_types = await get_all_type_device()
		logger.debug(f"Found {len(device_types)} device type mappings")
		return device_types
	except Exception as e:
		logger.error(f"Error fetching device types: {str(e)}", exc_info=True)
		raise HTTPException(
			status_code=400,
			detail=str(e))

@router.delete("/{system_name}", status_code=200)
async def delete_type_dev(system_name: str):
	"""Delete device type mapping by device system name"""
	try:
		logger.info(f"Deleting device type for: {system_name}")
		await delete_type_device_by_device(system_name)
		logger.info(f"Successfully deleted device type for: {system_name}")
		return {"message": "Device type deleted successfully"}
	except Exception as e:
		logger.error(f"Error deleting device type {system_name}: {str(e)}", exc_info=True)
		raise HTTPException(
			status_code=400,
			detail=str(e))