import logging
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from typing import Optional, List, Union

router = APIRouter(
    prefix="/api-devices/automation",
    tags=["automation"],
    responses={404: {"description": "Not found"}},
)

logger = logging.getLogger(__name__)

# Добавление устройства
@router.post("")
async def test(data):
    try:
        return JSONResponse(status_code=200, content={"message": "ok"})
    except Exception as e:
        logger.warning(str(e))
        return JSONResponse(status_code=400, content={"error": str(e)})

