import jwt, logging
from jwt import ExpiredSignatureError
from datetime import datetime
from typing import Annotated
from fastapi import Header, HTTPException
from fastapi.responses import JSONResponse

from app.configuration import settings
from app.internal.exceptions.base import InvalidInputException

from app.internal.user.logic.get_user import get_user
from app.internal.role.logic.get_role import get_role
from app.internal.role.models.role import Role

from app.internal.auth.schemas.depends import AuthHeaders, TokenData, UserDepData, SessionDepData
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

async def auth(Authorization)->TokenData:
	print(Authorization)
	head = Authorization
	jwtdata = head.split(" ")[1]
	print(jwtdata)
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
	return TokenData(user_id = data['user_id'], user_role = user.role)

async def token_dep(headers: Annotated[AuthHeaders, Header()]):
	print(headers)
	headers.Authorization
	if not headers.Authorization:
		raise HTTPException(status_code=403, detail="token not found")
	try:
		auth_data = await auth(headers.Authorization)
		user = await get_user(auth_data.user_id)
		print("role user", user.role)
		if user.role:
			raise HTTPException(status_code=403, detail="user is not assigned a role")
		return auth_data
	except HTTPException as e:
		raise
	except ExpiredSignatureError as e:
		raise HTTPException(status_code=401, detail="outdated jwt")
	except Exception as e:
		logger.warning(f"token_dep error {e}")
		raise HTTPException(status_code=403, detail="invalid jwt")
	
async def user_dep(headers: Annotated[AuthHeaders, Header()])->UserDepData:
	headers.Authorization
	if not headers.Authorization:
		raise HTTPException(status_code=403, detail="token not found")
	try:
		auth_data = await auth(headers.Authorization)
		user = await get_user(auth_data.user_id)
		role = await get_role(auth_data.user_role)
		print("role user", user, role)
		if not user or not role:
			logger.error(f"user not found")
			raise HTTPException(status_code=403, detail="user not found")
		return UserDepData(user=user, role=role)
	except HTTPException as e:
		raise
	except ExpiredSignatureError as e:
		raise HTTPException(status_code=401, detail="outdated jwt")
	except Exception as e:
		logger.warning(f"token_dep error {e}")
		raise HTTPException(status_code=403, detail="invalid jwt")

async def session_dep(headers: Annotated[AuthHeaders, Header()])->SessionDepData:
	try:
		if not headers.Authorization:
			raise HTTPException(status_code=403, detail="invalid jwt")
		jwtdata = headers.Authorization.split(" ")[1]
		auth_data = await auth(headers.Authorization)
		user = await get_user(auth_data.user_id)
		role = await get_role(auth_data.user_role)
		if not user or not role:
			logger.error(f"user or role not found")
			raise HTTPException(status_code=403, detail="user or role not found")
		u_session = await Session.objects.get_or_none(access=jwtdata, user=user)
		if not u_session:
			logger.error(f"session not found")
			raise HTTPException(status_code=403, detail="session not found")
		return SessionDepData(user=user, role=role, session=u_session)
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
	async def _user_role_dep(headers: Annotated[AuthHeaders, Header()]):
		try:
			if not headers.Authorization:
				raise HTTPException(status_code=403, detail="invalid jwt")
			jwtdata = headers.Authorization.split(" ")[1]
			auth_data = await auth(headers.Authorization)
			user = await get_user(auth_data.user_id)
			role = await get_role(auth_data.user_role)
			if not user or not role:
				logger.error(f"user or role not found")
				raise HTTPException(status_code=403, detail="user or role not found")
			if(privilege == settings.BASE_ROLE.ADMIN and role.role_name != settings.BASE_ROLE.ADMIN):
				return HTTPException(status_code=403, detail="not enough rights for the operation.")
			elif(not check_privilege(role, privilege)):
				return HTTPException(status_code=403, detail="not enough rights for the operation.")
			u_session = await Session.objects.get_or_none(access=jwtdata, user=user)
			if not u_session:
				logger.error(f"session not found")
				raise HTTPException(status_code=403, detail="session not found")
			return SessionDepData(user=user, role=role, session=u_session)
		except HTTPException as e:
			raise
		except ExpiredSignatureError as e:
			raise HTTPException(status_code=401, detail="outdated jwt")
		except Exception as e:
			logger.warning(f"token_dep error {e}")
			raise HTTPException(status_code=403, detail="invalid jwt")
	return _user_role_dep