import logging
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from typing import Optional, List


router = APIRouter(
	prefix="/api/devices",
	tags=["device"],
	responses={404: {"description": "Not found"}},
)

logger = logging.getLogger(__name__)