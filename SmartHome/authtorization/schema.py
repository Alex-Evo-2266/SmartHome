import datetime
from enum import Enum
from typing import List
from pydantic import BaseModel

class UserLevel(str, Enum):
	BASE = "base",
	ADMIN = "admin",
	TERMINAL = "terminal",

class Login(BaseModel):
	name: str
	password: str

class ServiceLogin(BaseModel):
	code: str

class ServiceData(BaseModel):
	name: str
	access: str
	refresh: str

class ResponseLogin(BaseModel):
	token: str
	expires_at: datetime.datetime
	id: int
	role: UserLevel

class Tokens(BaseModel):
	expires_at: datetime.datetime
	access: str
	refresh: str

class RefrashToken(BaseModel):
	refresh_token: str

class Token(BaseModel):
	token: str
	expires_at: datetime.datetime

class AuthServiceTokens(BaseModel):
	user_name: str
	access_token: str
	expires_at: datetime.datetime
	token_type: str
	refresh_token: str
	scope: List[str]


# from pydantic import BaseModel
# from enum import Enum
# from typing import Type, TypeVar, List, Optional, Any
# import logging

# logger = logging.getLogger(__name__)

# class TypeRespons(str, Enum):
# 	OK = "ok"
# 	ERROR = "error"
# 	INVALID = "invalid"
# 	NOT_FOUND = "not_found"

# class FunctionRespons(BaseModel):
# 	status: TypeRespons
# 	data: Any = ""
# 	detail: str = ""

# 	def __init__(self, *args, **kwargs):
# 		super().__init__(*args, **kwargs)
# 		if self.status == TypeRespons.ERROR:
# 			logger.warning(self.detail)
# 		if self.status == TypeRespons.INVALID:
# 			logger.info(self.detail)