from asyncio.log import logger
import json, logging

from app.configuration.settings import ROUTE_PREFIX

from fastapi import APIRouter, Response, Cookie, Depends, Header
from fastapi.responses import JSONResponse
from typing import Optional, Annotated

from app.internal.exceptions.base import InvalidInputException

from app.internal.user.models.user import User

from app.internal.auth.logic.login import login_data_check
from app.internal.auth.logic.create_session import create_session
from app.internal.auth.logic.get_session import get_token
from app.internal.auth.logic.delete_session import delete_session
from app.internal.auth.logic.refresh import refresh_token
from app.internal.role.logic.get_privilege import get_privilege
from app.internal.auth.models.auth import Session
from app.internal.auth.schemas.auth import Login, LoginHeaders
from app.internal.auth.schemas.depends import SessionDepData
from app.internal.auth.depends.auth import session_dep

logger = logging.getLogger(__name__)

router = APIRouter(
	prefix=f"{ROUTE_PREFIX}",
	tags=["auth"],
	responses={404: {"description": "Not found"}},
)

@router.post("/login")
async def login(headers: Annotated[LoginHeaders, Header()], response:Response = Response("ok", 200), data: Login = Login(name="", password="")):
	try:
		user = await login_data_check(data)
		session = await create_session(user, headers.Host)
		tokens = await get_token(session)
		await user.role.load()
		response.set_cookie(key="smart_home", value=tokens.refresh, httponly=True)
		response.headers["Authorization"]= f"Bearer {tokens.access}"
		response.headers["X-Token-Expires-At"]=str(tokens.expires_at.timestamp())
		response.headers["X-User-Role"]=user.role.role_name
		response.headers["X-User-Privilege"]= ", ".join([privilege.privilege for privilege in await get_privilege(user.role)])
		response.headers["X-Status-Auth"] = "ok"
		response.headers["X-User-Id"]=user.id
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
		session: Session = await Session.objects.get_or_none(access=tokens.access)
		if not session:
			raise Exception("session not found")
		await session.user.load()
		await session.user.role.load()
		response.set_cookie(key="smart_home", value=tokens.refresh, httponly=True)
		response.headers["Authorization"]= f"Bearer {tokens.access}"
		response.headers["X-Token-Expires-At"]=str(tokens.expires_at.timestamp())
		response.headers["X-User-Role"]=session.user.role.role_name
		response.headers["X-User-Privilege"]= ", ".join([privilege.privilege for privilege in await get_privilege(session.user.role)])
		response.headers["X-Status-Auth"] = "ok"
		response.headers["X-User-Id"]=session.user.id
		return "ok"
	except InvalidInputException as e:
		return JSONResponse(status_code=403, content={"message": str(e)})
	except Exception as e:
		logger.error(str(e))
		return JSONResponse(status_code=400, content={"message": str(e)})
	
@router.get("/check")
async def chack_user(response:Response = Response("ok", 200), session:SessionDepData = Depends(session_dep)):
	response.headers["X-Status-Auth"] = "ok"
	response.headers["X-User-Role"] = session.role.role_name
	response.headers["X-User-Privilege"]= ", ".join([privilege.privilege for privilege in await get_privilege(session.role)])
	response.headers["X-User-Id"]=session.user.id
	return "ok"

@router.get("/logout")
async def logout(response:Response = Response("ok", 200), userData:SessionDepData = Depends(session_dep)):
	try:
		response.set_cookie(key="smart_home", value="", httponly=True)
		response.headers["Authorization"]=""
		response.headers["X-Token-Expires-At"]=""
		await delete_session(userData.session.id)
		return "ok"
	except InvalidInputException as e:
		return JSONResponse(status_code=403, content={"message": str(e)})
	except Exception as e:
		logger.error(str(e))
		return JSONResponse(status_code=400, content={"message": str(e)})