import logging
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from typing import Optional, List, Union
from app.ingternal.device.schemas.device import DeviceSchema, StatusForm, DeviceSerializeSchema
from app.ingternal.device.schemas.add_device import AddDeviceSchema
from app.ingternal.device.schemas.edit_device import EditDeviceSchema
from app.ingternal.device.schemas.config import DeviceClassConfigSchema


router = APIRouter(
    prefix="/api-devices/scripts",
    tags=["device"],
    responses={404: {"description": "Not found"}},
)

logger = logging.getLogger(__name__)

# Добавление устройства
@router.post("")
async def test(data: AddDeviceSchema):
    try:
        return JSONResponse(status_code=200, content={"message": "ok"})
    except Exception as e:
        logger.warning(str(e))
        return JSONResponse(status_code=400, content={"error": str(e)})

