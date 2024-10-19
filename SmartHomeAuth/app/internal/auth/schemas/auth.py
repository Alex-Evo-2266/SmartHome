import datetime
from pydantic import BaseModel

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