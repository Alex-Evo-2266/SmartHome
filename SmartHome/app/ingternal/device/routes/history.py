import logging
from fastapi import APIRouter
from fastapi.responses import JSONResponse

from app.ingternal.device.serialize_model.value import get_device_history, get_field_history
from app.ingternal.device.schemas.device import ValueSerializeResponseListSchema, ValueSerializeResponseSchema

router = APIRouter(
    prefix="/api-devices/stories",
    tags=["history"],
    responses={404: {"description": "Not found"}},
)

logger = logging.getLogger(__name__)


@router.get("/field/{field_id}", response_model=ValueSerializeResponseSchema)
async def get_device_values(field_id: str):
    try:
        logger.info(f"history field: {field_id}")
        return await get_field_history(field_id)
    except Exception as e:
        logger.warning(str(e))
        return JSONResponse(status_code=400, content={"error": str(e)})
    
@router.get("/device/{system_name}", response_model=ValueSerializeResponseListSchema)
async def get_device_values(system_name: str):
    try:
        logger.info(f"history device: {system_name}")
        return await get_device_history(system_name)
    except Exception as e:
        logger.warning(str(e))
        return JSONResponse(status_code=400, content={"error": str(e)})