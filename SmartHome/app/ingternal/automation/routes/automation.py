import logging
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from typing import Optional, List, Union

from app.ingternal.automation.schemas.automation import AutomationSchema, EnableSchema, AutomationResponseSchema
from app.ingternal.automation.serialize_model.add_automation import add_automation
from app.ingternal.automation.serialize_model.get_model import get_automation, get_all_automation
from app.ingternal.automation.serialize_model.delete import delete_automation
from app.ingternal.automation.serialize_model.update import update_automation, update_status

router = APIRouter(
    prefix="/api-devices/automation",
    tags=["automation"],
    responses={404: {"description": "Not found"}},
)

logger = logging.getLogger(__name__)

# Добавление устройства
@router.post("")
async def test(data: AutomationSchema):
    try:
        await add_automation(data)
        return JSONResponse(status_code=200, content={"message": "ok"})
    except Exception as e:
        logger.warning(str(e))
        return JSONResponse(status_code=400, content={"error": str(e)})

@router.get("", response_model=AutomationResponseSchema)
async def get_all():
    try:
        return AutomationResponseSchema(data=await get_all_automation())
    except Exception as e:
        logger.warning(str(e))
        return JSONResponse(status_code=400, content={"error": str(e)})


@router.get("/{name}", response_model=AutomationSchema)
async def get(name:str):
    try:
        return await get_automation(name)
    except Exception as e:
        logger.warning(str(e))
        return JSONResponse(status_code=400, content={"error": str(e)})

@router.delete("/{name}")
async def delete_automation_api(name:str):
    try:
        await delete_automation(name)
        return JSONResponse(status_code=200, content={"message": "ok"})
    except Exception as e:
        logger.warning(str(e))
        return JSONResponse(status_code=400, content={"error": str(e)})

@router.put("/{name}")
async def delete_automation_api(name:str, data: AutomationSchema):
    try:
        await update_automation(name, data)
        return JSONResponse(status_code=200, content={"message": "ok"})
    except Exception as e:
        logger.warning(str(e))
        return JSONResponse(status_code=400, content={"error": str(e)})

@router.patch("/{name}/enable")
async def delete_automation_api(name:str, data: EnableSchema):
    try:
        await update_status(name, data.is_enabled)
        return JSONResponse(status_code=200, content={"message": "ok"})
    except Exception as e:
        logger.warning(str(e))
        return JSONResponse(status_code=400, content={"error": str(e)})

