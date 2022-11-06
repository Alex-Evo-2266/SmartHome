from lib2to3.pgen2 import token
import logging
from os import access
from typing import Optional
from unicodedata import name
from fastapi import APIRouter, Response, Depends, Cookie
from fastapi.responses import JSONResponse
from SmartHome.depends.auth import session, token_dep
from authtorization.exceptions import InvalidInputException
from auth_service.auth_service import get_auth_service_tokens
from authtorization.models import Session, User
from authtorization.logic import create_session, create_tokens_oauth, create_valid_user_name, delete_session, get_token, local_login, refresh_token

from settings import AUTH_SERVICE_URL, configManager

from .schema import AuthType, Login, ResponseLogin, ServiceLogin, Tokens

logger = logging.getLogger(__name__)

router = APIRouter(
	prefix="/api/auth",
	tags=["auth"],
	responses={404: {"description": "Not found"}},
)

@router.post("/login", response_model=ResponseLogin)
async def login(response:Response = Response("ok", 200), data: Login = Login(name="", password="")):
	try:
		user = await local_login(data)
		session = await create_session(user)
		tokens = await get_token(session)
		response.set_cookie(key="smart_home", value=tokens.refresh, httponly=True)
		return ResponseLogin(token=tokens.access, expires_at=tokens.expires_at, id=user.id, role=user.role)
	except InvalidInputException as e:
		return JSONResponse(status_code=403, content={"message": str(e)})
	except Exception as e:
		logger.error(str(e))
		return JSONResponse(status_code=400, content={"message": str(e)})

@router.get("/refresh", response_model=ResponseLogin)
async def refrash(response:Response = Response("ok", 200), smart_home: Optional[str] = Cookie(None)):
	try:
		print("p00")
		tokens = await refresh_token(smart_home)
		print("p2")
		response.set_cookie(key="smart_home", value=tokens.refresh, httponly=True)
		print("p3")
		session = await Session.objects.get_or_none(access=tokens.access)
		print("p4")
		if not session:
			raise Exception("create tokens error")
		print("p4")
		user = await User.objects.get_or_none(id=session.user.id)
		print("p5")
		return ResponseLogin(token=tokens.access, expires_at=tokens.expires_at, id=user.id, role=user.role)
	except InvalidInputException as e:
		return JSONResponse(status_code=403, content={"message": str(e)})
	except Exception as e:
		logger.error(str(e))
		return JSONResponse(status_code=400, content={"message": str(e)})

@router.post("", response_model=ResponseLogin)
async def login_auth_service(response:Response = Response("ok", 200), data: ServiceLogin = ServiceLogin(code="")):
	try:
		body = await get_auth_service_tokens(data.code)
		user = await User.objects.get_or_none(auth_service_id = body.user_id)
		if not user:
			user_dubl = await User.objects.get_or_none(name = body.user_name)
			user_name = body.user_name
			if user_dubl:
				user_name = await create_valid_user_name(body.user_name)
			user = await User.objects.create(name=user_name, auth_service_id=body.user_id, auth_service_name = body.user_name, auth_type=AuthType.AUTH_SERVICE)
		tokens = await create_tokens_oauth(user, body.access_token, body.refresh_token)
		response.set_cookie(key="smart_home", value=tokens.refresh, httponly=True)
		return ResponseLogin(token=tokens.access, expires_at=tokens.expires_at, id=user.id, role=user.role)
	except Exception as e:
		logger.error(e)
		return JSONResponse(status_code=400, content={"message": str(e)})

@router.get("/logout")
async def logout(auth_data: dict = Depends(token_dep), session:Session = Depends(session)):
	try:
		await delete_session(session)
		return "ok"
	except InvalidInputException as e:
		return JSONResponse(status_code=403, content={"message": str(e)})
	except Exception as e:
		logger.error(str(e))
		return JSONResponse(status_code=400, content={"message": str(e)})