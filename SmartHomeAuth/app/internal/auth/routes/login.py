from asyncio.log import logger
import json, logging

from app.configuration.settings import ROUTE_PREFIX

from fastapi import APIRouter, Response, Cookie, Depends
from fastapi.responses import JSONResponse
from typing import Optional, List

from app.internal.exceptions.base import InvalidInputException

from app.internal.user.models.user import User

from app.internal.auth.logic.login import login_data_check
from app.internal.auth.logic.create_session import create_session
from app.internal.auth.logic.get_session import get_token
from app.internal.auth.logic.refresh import refresh_token
from app.internal.auth.models.auth import Session
from app.internal.auth.schemas.auth import Login
from app.internal.auth.schemas.depends import SessionDepData
from app.internal.auth.depends.auth import token_dep, session_dep

logger = logging.getLogger(__name__)

router = APIRouter(
	prefix=f"{ROUTE_PREFIX}",
	tags=["auth"],
	responses={404: {"description": "Not found"}},
)

@router.post("/login")
async def login(response:Response = Response("ok", 200), data: Login = Login(name="", password="")):
	try:
		user = await login_data_check(data)
		session = await create_session(user)
		tokens = await get_token(session)
		await user.role.load()
		response.set_cookie(key="smart_home", value=tokens.refresh, httponly=True)
		response.headers["X-token"]=tokens.access
		response.headers["X-token-expires-at"]=str(tokens.expires_at.timestamp())
		response.headers["X-user-role"]=user.role.role_name
		response.headers["X-user-id"]=user.id
		return "ok"
	except InvalidInputException as e:
		return JSONResponse(status_code=403, content={"message": str(e)})
	except Exception as e:
		logger.error(str(e))
		return JSONResponse(status_code=400, content={"message": str(e)})

@router.get("/refresh")
async def refrash(response:Response = Response("ok", 200), smart_home: Optional[str] = Cookie(None)):
	try:
		if not smart_home:
			raise Exception("tokens error")
		tokens = await refresh_token(smart_home)
		response.set_cookie(key="smart_home", value=tokens.refresh, httponly=True)
		session = await Session.objects.get_or_none(access=tokens.access)
		if not session:
			raise Exception("session not found")
		await session.user.load()
		await session.user.role.load()
		response.set_cookie(key="smart_home", value=tokens.refresh, httponly=True)
		response.headers["X-token"]=tokens.access
		response.headers["X-token-expires-at"]=str(tokens.expires_at.timestamp())
		response.headers["X-user-role"]=session.user.role.role_name
		response.headers["X-user-id"]=session.user.id
		return "ok"
	except InvalidInputException as e:
		return JSONResponse(status_code=403, content={"message": str(e)})
	except Exception as e:
		logger.error(str(e))
		return JSONResponse(status_code=400, content={"message": str(e)})
	
@router.get("/check")
async def chack_user(response:Response = Response("ok", 200), session:SessionDepData = Depends(session_dep)):
	response.headers["X-status-auth"] = "ok"
	response.headers["X-user-role"] = session.role.role_name
	return "ok"
