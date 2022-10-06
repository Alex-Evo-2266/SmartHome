import datetime
from pydantic import BaseModel

class Login(BaseModel):
    name: str
    password: str

class Tokens(BaseModel):
	expires_at: datetime.datetime
	access: str
	refresh: str

class Token(BaseModel):
    token: str


class TokenData(BaseModel):
    user_id: str
    user_level: str

class AuthService(BaseModel):
    clientId: str
    authservice: str
    host: str

class OAuthLogin(BaseModel):
    code: str

class ResponseLogin(BaseModel):
	token: str
	expires_at: datetime.datetime
	userId: int
	userLevel: int