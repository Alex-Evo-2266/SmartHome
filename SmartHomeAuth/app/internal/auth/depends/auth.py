import jwt, logging
from jwt import ExpiredSignatureError
from datetime import datetime
from typing import Annotated, Optional
from fastapi import Header, HTTPException, Request

from app.configuration import settings
from app.internal.exceptions.base import InvalidInputException

from app.internal.user.logic.get_user import get_user
from app.internal.auth.logic.refresh import refresh_token
from app.internal.role.models.role import Role

from app.internal.auth.schemas.depends import AuthHeaders, UserDepData, SessionDepData
from app.internal.auth.models.auth import Session

logger = logging.getLogger(__name__)


class RoleNotAssignedException(Exception):
	def __init__(self, *args: object) -> None:
		if args:
			self.message = args[0]
		else:
			self.message = "user is not assigned a role"
	
	def __str__(self) -> str:
		if self.message:
			return f"RoleNotAssignedException, {self.message}"
		else:
			return "RoleNotAssignedException"
		
def getJWT(token: str):
	token_d = token.split(" ")
	if len(token_d) == 2 and token_d[0] == 'Bearer':
		return token_d[1]

async def auth(jwtdata:str)->UserDepData:
	data = jwt.decode(jwtdata,settings.SECRET_JWT_KEY,algorithms=[settings.ALGORITHM])
	if not('exp' in data and 'user_id' in data and data['sub'] == "access"):
		logger.worning(f"no data in jwt")
		raise InvalidInputException("no data in jwt")
	if (datetime.now(settings.TIMEZONE) > datetime.fromtimestamp(data['exp'], settings.TIMEZONE)):
		logger.debug(f"outdated jwt")
		raise ExpiredSignatureError("outdated jwt")
	user = await get_user(data['user_id'])
	logger.info(f"the user is logged in. id:{data['user_id']}")
	await user.role.load()
	return UserDepData(user=user, role=user.role)

async def session_dep(request: Request)->SessionDepData:
	try:
		headers_data = { 
			"Authorization": request.headers.get("authorization"),
			"X_status_auth": request.headers.get("x-status-auth"),
			"X_forwarded_for": request.headers.get("x-forwarded-for"),
			"X_user_id": request.headers.get("x-user-id"),
			"X_user_role": request.headers.get("x-user-role"),
			"Host": request.headers.get("host"),
			"X_user_privilege": request.headers.get("x-user-privilege"),
		}
		jwtdata = getJWT(headers_data["Authorization"])
		if not jwtdata:
			raise HTTPException(status_code=403, detail="invalid jwt")
		auth_data = await auth(jwtdata)
		if not auth_data.user or not auth_data.role:
			logger.error(f"user or role not found")
			raise HTTPException(status_code=403, detail="user or role not found")
		u_session = await Session.objects.get_or_none(access=jwtdata, user=auth_data.user)
		if not u_session:
			logger.error(f"session not found")
			raise HTTPException(status_code=403, detail="session not found")
		return SessionDepData(user=auth_data.user, role=auth_data.role, session=u_session)
	except HTTPException as e:
		raise
	except ExpiredSignatureError as e:
		raise HTTPException(status_code=401, detail="outdated jwt")
	except Exception as e:
		logger.warning(f"token_dep error {e}")
		raise HTTPException(status_code=403, detail="invalid jwt")
	
def check_privilege(role: Role, privilege:str):
	return True
	
def user_preveleg_dep(privilege: str | settings.BASE_ROLE):
	async def _user_role_dep(request: Request):
		try:
			headers_data = { 
				"Authorization": request.headers.get("authorization"),
				"X_status_auth": request.headers.get("x-status-auth"),
				"X_forwarded_for": request.headers.get("x-forwarded-for"),
				"X_user_id": request.headers.get("x-user-id"),
				"X_user_role": request.headers.get("x-user-role"),
				"Host": request.headers.get("host"),
				"X_user_privilege": request.headers.get("x-user-privilege"),
			}
			jwtdata = getJWT(headers_data["Authorization"])
			if not jwtdata:
				raise HTTPException(status_code=403, detail="invalid jwt")
			auth_data = await auth(jwtdata)
			if not auth_data.user or not auth_data.role:
				logger.error(f"user or role not found")
				raise HTTPException(status_code=403, detail="user or role not found")
			if(privilege == settings.BASE_ROLE.ADMIN and auth_data.role.role_name != settings.BASE_ROLE.ADMIN):
				return HTTPException(status_code=403, detail="not enough rights for the operation.")
			elif(not check_privilege(auth_data.role, privilege)):
				return HTTPException(status_code=403, detail="not enough rights for the operation.")
			u_session = await Session.objects.get_or_none(access=jwtdata, user=auth_data.user)
			if not u_session:
				logger.error(f"session not found")
				raise HTTPException(status_code=403, detail="session not found")
			return SessionDepData(user=auth_data.user, role=auth_data.role, session=u_session)
		except HTTPException as e:
			raise
		except ExpiredSignatureError as e:
			raise HTTPException(status_code=401, detail="outdated jwt")
		except Exception as e:
			logger.warning(f"token_dep error {e}")
			raise HTTPException(status_code=403, detail="invalid jwt")
	return _user_role_dep