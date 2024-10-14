from asyncio.log import logger
import json, logging

from app.configuration.settings import ROUTE_PREFIX

from fastapi import APIRouter, Response, Cookie
from fastapi.responses import JSONResponse
from typing import Optional, List

from app.internal.exceptions.base import InvalidInputException

from app.internal.user.models.user import User

from app.internal.auth.logic.login import login_data_check
from app.internal.auth.logic.session import create_session, get_token
from app.internal.auth.logic.refresh import refresh_token
from app.internal.auth.models.auth import Session
from app.internal.auth.schemas.auth import Login, ResponseLogin

logger = logging.getLogger(__name__)

router = APIRouter(
	prefix=f"{ROUTE_PREFIX}/session",
	tags=["user"],
	responses={404: {"description": "Not found"}},
)

@router.delete("", response_model=ResponseLogin)
async def session_delete(response:Response = Response("ok", 200), data: Login = Login(name="", password="")):
    pass

@router.get("", response_model=ResponseLogin)
async def session_delete(response:Response = Response("ok", 200), data: Login = Login(name="", password="")):
    pass