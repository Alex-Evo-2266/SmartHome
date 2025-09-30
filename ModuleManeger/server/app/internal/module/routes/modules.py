import json, logging
from typing import Optional, List

from app.configuration.settings import ROUTE_PREFIX

from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse

logger = logging.getLogger(__name__)

router = APIRouter(
	prefix=f"{ROUTE_PREFIX}/modules",
	tags=["modules"],
	responses={404: {"description": "Not found"}},
)
	
@router.get("/all")
async def get_role():
	try:
		return "ok"
	except Exception as e:
		return JSONResponse(status_code=400, content=str(e))
