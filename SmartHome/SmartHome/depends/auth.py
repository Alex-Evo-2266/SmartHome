from datetime import datetime
from fastapi import Header, HTTPException
from typing import Optional

from jwt import ExpiredSignatureError
import jwt, settings, logging
from authtorization.schema import UserLevel
from SmartHome.exceptions import InvalidInputException

from SmartHome.schemas.auth import TokenData
from authtorization.models import Session, User

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
	head = Authorization
	jwtdata = head.split(" ")[1]
	data = jwt.decode(jwtdata,settings.SECRET_JWT_KEY,algorithms=[settings.ALGORITHM])
	if not('exp' in data and 'user_id' in data and data['sub'] == "access"):
		logger.worning(f"no data in jwt")
		raise InvalidInputException("no data in jwt")
	if (datetime.now(settings.TIMEZONE) > datetime.fromtimestamp(data['exp'], settings.TIMEZONE)):
		logger.debug(f"outdated jwt")
		raise ExpiredSignatureError("outdated jwt")
	user = await User.objects.get(id=data['user_id'])
	logger.info(f"the user is logged in. id:{data['user_id']}")
	return TokenData(user_id = data['user_id'], user_level = user.role)

async def token_dep(authorization_token: Optional[str] = Header(None)):
	if not authorization_token:
		raise HTTPException(status_code=403, detail="token not found")
	try:
		auth_data = await auth(authorization_token)
		user = await User.objects.get_or_none(id=auth_data.user_id)
		if user.role == UserLevel.NONE:
			raise HTTPException(status_code=403, detail="user is not assigned a role")
		return auth_data
	except HTTPException as e:
		raise
	except ExpiredSignatureError as e:
		raise HTTPException(status_code=401, detail="outdated jwt")
	except Exception as e:
		logger.warning(f"token_dep error {e}")
		raise HTTPException(status_code=403, detail="invalid jwt")

async def token_dep_all_user(authorization_token: Optional[str] = Header(None)):
	if not authorization_token:
		raise HTTPException(status_code=403, detail="token not found")
	try:
		auth_data = await auth(authorization_token)
		return auth_data
	except ExpiredSignatureError as e:
		raise HTTPException(status_code=401, detail="outdated jwt")
	except Exception as e:
		logger.warning(f"token_dep error {e}")
		raise HTTPException(status_code=403, detail="invalid jwt")

async def session(authorization_token: Optional[str] = Header(None))->Session:
	head = authorization_token
	jwtdata = head.split(" ")[1]
	data = await auth(authorization_token)
	data.user_id
	user = await User.objects.get_or_none(id=data.user_id)
	if not user:
		logger.error(f"user not found")
		raise HTTPException(status_code=403, detail="user not found")
	u_session = await Session.objects.get_or_none(access=jwtdata, user=user)
	if not u_session:
		logger.error(f"session not found")
		raise HTTPException(status_code=403, detail="session not found")
	return u_session
	
	