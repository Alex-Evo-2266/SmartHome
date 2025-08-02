import datetime
from pydantic import BaseModel
from typing import Optional, List

class Login(BaseModel):
	name: str
	password: str
	
class Tokens(BaseModel):
	access: str
	refresh: str
	expires_at: datetime.datetime

class SessionSchema(BaseModel):
	id: str
	service: str
	expires_at: datetime.datetime
	host: str

class LoginHeaders(BaseModel):
	Host: Optional[str] = None

class TempTokenData(BaseModel):
	token: str
	
class ConfigFilePageData(BaseModel):
	roles: List[str]
	iframe_only: bool
	service: str
	path: str
	full_path: str

class ConfigFileData(BaseModel):
	pages: List[ConfigFilePageData]