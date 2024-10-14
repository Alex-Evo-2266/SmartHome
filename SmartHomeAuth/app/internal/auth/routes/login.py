from asyncio.log import logger
import json, logging

from app.configuration.settings import ROUTE_PREFIX

from fastapi import APIRouter, Response, Cookie, Depends
from fastapi.responses import JSONResponse
from typing import Optional, List

from app.internal.exceptions.base import InvalidInputException

from app.internal.user.models.user import User

from app.internal.auth.logic.login import login_data_check
from app.internal.auth.logic.session import create_session, get_token
from app.internal.auth.logic.refresh import refresh_token
from app.internal.auth.models.auth import Session
from app.internal.auth.schemas.auth import Login, ResponseLogin, TokenData
from app.internal.auth.depends.auth import token_dep

logger = logging.getLogger(__name__)

router = APIRouter(
	prefix=f"{ROUTE_PREFIX}",
	tags=["user"],
	responses={404: {"description": "Not found"}},
)

@router.post("/login", response_model=ResponseLogin)
async def login(response:Response = Response("ok", 200), data: Login = Login(name="", password="")):
	try:
		user = await login_data_check(data)
		session = await create_session(user)
		tokens = await get_token(session)
		response.set_cookie(key="smart_home", value=tokens.refresh, httponly=True)
		return ResponseLogin(token=tokens.access, expires_at=tokens.expires_at, id=user.id, role='')
	except InvalidInputException as e:
		return JSONResponse(status_code=403, content={"message": str(e)})
	except Exception as e:
		logger.error(str(e))
		return JSONResponse(status_code=400, content={"message": str(e)})

@router.get("/refresh", response_model=ResponseLogin)
async def refrash(response:Response = Response("ok", 200), smart_home: Optional[str] = Cookie(None)):
	try:
		if not smart_home:
			raise Exception("tokens error")
		tokens = await refresh_token(smart_home)
		response.set_cookie(key="smart_home", value=tokens.refresh, httponly=True)
		session = await Session.objects.get_or_none(access=tokens.access)
		if not session:
			raise Exception("create tokens error")
		user = await User.objects.get_or_none(id=session.user.id)
		return ResponseLogin(token=tokens.access, expires_at=tokens.expires_at, id=user.id, role='')
	except InvalidInputException as e:
		return JSONResponse(status_code=403, content={"message": str(e)})
	except Exception as e:
		logger.error(str(e))
		return JSONResponse(status_code=400, content={"message": str(e)})
	
@router.get("/check", response_model=ResponseLogin)
async def chack_user(auth_data: TokenData = Depends(token_dep)):
	pass