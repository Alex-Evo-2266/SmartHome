from lib2to3.pgen2 import token
import logging
from unicodedata import name
from fastapi import APIRouter, Response
from fastapi.responses import JSONResponse
from authtorization.exceptions import InvalidInputException
from authtorization.auth_service import get_auth_service_tokens
from authtorization.models import AuthType, User
from authtorization.logic import create_session, create_tokens_oauth, create_valid_user_name, get_token, local_login

from settings import AUTH_SERVICE_URL, configManager

from .schema import Login, ResponseLogin, ServiceLogin, Tokens

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
		response.set_cookie(key="refresh_toket", value=tokens.refresh, httponly=True)
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
		user = await User.objects.get_or_none(auth_service_name = body.user_name)
		if not user:
			user_dubl = await User.objects.get_or_none(name = body.user_name)
			user_name = body.user_name
			if user_dubl:
				user_name = await create_valid_user_name(body.user_name)
			user = await User.objects.create(name=user_name, auth_service_name = body.user_name, auth_type=AuthType.AUTH_SERVICE)
		tokens = await create_tokens_oauth(user, body.access_token, body.refresh_token)
		response.set_cookie(key="refresh_toket", value=tokens.refresh, httponly=True)
		return ResponseLogin(token=tokens.access, expires_at=tokens.expires_at, id=user.id, role=user.role)
	except Exception as e:
		logger.error(e)
		return JSONResponse(status_code=400, content={"message": str(e)})