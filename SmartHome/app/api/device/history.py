import logging
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from app.pkg.deps.auth import auth_privilege_dep
from datetime import datetime

from app.db.repositories.device.value import get_device_history, get_field_history
from app.schemas.device.device import ValueSerializeResponseListSchema, ValueSerializeResponseSchema

router = APIRouter(
    prefix="/api-devices/stories",
    tags=["history"],
    responses={404: {"description": "Not found"}},
)

logger = logging.getLogger(__name__)

@router.get("/field/{field_id}", response_model=ValueSerializeResponseSchema)
async def get_device_values(field_id: str, time_start: str | None = None, user_id:str=Depends(auth_privilege_dep("device"))):
    try:
        datetime_object = datetime.fromisoformat(time_start) if time_start else None
        logger.info(f"history field: {field_id}")
        return await get_field_history(field_id, datetime_object)
    except Exception as e:
        logger.warning(str(e))
        return JSONResponse(status_code=400, content={"error": str(e)})
    
@router.get("/device/{system_name}", response_model=ValueSerializeResponseListSchema)
async def get_device_values(system_name: str, time_start: str | None = None, user_id:str=Depends(auth_privilege_dep("device"))):
    try:
        datetime_object = datetime.fromisoformat(time_start) if time_start else None
        logger.info(f"history device: {system_name}")
        return await get_device_history(system_name, datetime_object)
    except Exception as e:
        logger.warning(str(e))
        return JSONResponse(status_code=400, content={"error": str(e)})