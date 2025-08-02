from asyncio.log import logger
import json, logging
from datetime import datetime
from urllib.parse import urlparse, parse_qs, urlencode
from app.configuration.settings import ROUTE_PREFIX, MODULES_COOKIES_NAME, MODULE_TOKEN_EXPIRE_MINUTES

from fastapi import APIRouter, Response, Cookie, Depends, Header, Request, HTTPException
from fastapi.responses import JSONResponse, RedirectResponse
from typing import Optional, Annotated

from app.internal.exceptions.base import InvalidInputException

from app.internal.user.models.user import User
from app.internal.role.models.role import Role

from app.internal.auth.logic.login import login_data_check
from app.internal.auth.logic.create_session import create_session
from app.internal.auth.logic.get_session import get_token
from app.internal.auth.logic.delete_session import delete_session
from app.internal.auth.logic.refresh import refresh_token
from app.internal.role.logic.get_privilege import get_privilege
from app.internal.auth.models.auth import Session
from app.internal.auth.schemas.auth import Login, LoginHeaders, TempTokenData
from app.internal.auth.schemas.depends import SessionDepData
from app.internal.auth.depends.auth import session_dep
from app.internal.auth.logic.token import create_token
from app.internal.auth.logic.service_auth import module_service_auth

from app.internal.auth.logic.get_session import get_session_by_id

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
	
@router.get("/module-service/temp-token", response_model=TempTokenData)
async def get_temp_token(service: str, session:SessionDepData = Depends(session_dep)):
	user: User = session.user
	role: Role = session.role
	token = await create_token(
		data={
			"user_id": user.id,
			"user_role": role.id
		},
		type="temp_token",
		service=service
	)
	return TempTokenData(token=token)
	
@router.get("/module-service/check")
async def chack_user(request: Request, module_auth_sh: Optional[str] = Cookie(None)):
	try:
		temp_token = request.query_params.get("temp_token")
		forwarded_uri = request.headers.get("X-Forwarded-Uri")
		scheme = request.headers.get("X-Forwarded-Proto", "http")
		host = request.headers.get("X-Forwarded-Host", "localhost")
		if not forwarded_uri:
			raise HTTPException(400, "Missing X-Forwarded-Uri")
			
		parsed = urlparse(forwarded_uri)
		query_params = parse_qs(parsed.query)
		cookies = request.cookies
		temp_token = query_params.get("temp_token", [None])[0]
		parts = parsed.path.strip("/").split("/")  

		if len(parts) < 2 or parts[0] != "modules":
			raise HTTPException(400, "Invalid path format")

		service = parts[1]  # service-b
		inner_path = "/" + "/".join(parts[2:]) if len(parts) > 2 else "/"

		if temp_token:
			session = await module_service_auth(temp_token=temp_token, path=inner_path, service=service, host=host)
			parsed = urlparse(forwarded_uri)
			query = parse_qs(parsed.query)
			query.pop("temp_token", None)  # удаляем temp_token
			clean_qs = urlencode(query, doseq=True)

			clean_path = parsed.path
			if clean_qs:
				clean_path += "?" + clean_qs
			absolute_url = f"{scheme}://{host}{clean_path}"
			resp = RedirectResponse(url=absolute_url)
			resp.set_cookie(
				key=MODULES_COOKIES_NAME,
				value=session.id,
				httponly=True,
				secure=True,
				samesite="none",
				path="/",   # доступно во всех путях
			)
			return resp
		else:
			print(request, cookies, module_auth_sh)
			session_id = cookies.get(MODULES_COOKIES_NAME)
			if not session_id:
				raise HTTPException(status_code=401, detail="No session cookie")
			
			sess: Session = await get_session_by_id(session_id)
			if not sess or sess.expires_at < datetime.utcnow():
				raise HTTPException(status_code=401, detail="Session expired")
			resp = Response(status_code=200)

			await sess.user.load()
			await sess.user.role.load()
			resp.headers["X-Status-Auth"] = "ok"
			resp.headers["X-User-Role"] = sess.user.role.role_name
			resp.headers["X-User-Privilege"]= ", ".join([privilege.privilege for privilege in await get_privilege(sess.user.role)])
			resp.headers["X-User-Id"]=sess.user.id
			return resp
	except HTTPException:
		raise
	except Exception as e:
		raise HTTPException(400, str(e))
	