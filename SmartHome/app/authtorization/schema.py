import datetime
from enum import Enum
from typing import List, Optional
from pydantic import BaseModel

class AuthType(str, Enum):
	AUTH_SERVICE = "auth_service",
	LOGIN = "login"

class UserLevel(str, Enum):
	NONE = "none",
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
	user_id: Optional[int]
	user_name: str
	access_token: str
	expires_at: datetime.datetime
	token_type: str
	refresh_token: str
	scope: List[str]

class SessionSchema(BaseModel):
	auth_type: AuthType
	expires_at: datetime.datetime
	id: int

class TokenData(BaseModel):
    user_id: int
    user_level: str


# class Login(BaseModel):
#     name: str
#     password: str

# class Tokens(BaseModel):
# 	expires_at: datetime.datetime
# 	access: str
# 	refresh: str

# class Token(BaseModel):
#     token: str



class AuthService(BaseModel):
    clientId: str
    authservice: str
    host: str

# class OAuthLogin(BaseModel):
#     code: str

# class ResponseLogin(BaseModel):
# 	token: str
# 	expires_at: datetime.datetime
# 	userId: int
# 	userLevel: int

class UserForm(BaseModel):
    name: str
    password: str
    email: str

class UserSchema(BaseModel):
    id: int
    name: str
    email: Optional[str]
    role: UserLevel = UserLevel.BASE
    image_url: Optional[str]
    auth_type: AuthType
    host: Optional[str]
    auth_name: Optional[str]

class UserEditSchema(BaseModel):
    name: str
    email: Optional[str] = ""

# class UserDeleteSchema(BaseModel):
#     id: int

# class UserNameSchema(BaseModel):
#     name: str

class UserEditLevelSchema(BaseModel):
    id: int
    role: UserLevel = UserLevel.NONE

class UserEditPasswordSchema(BaseModel):
    old_password: str
    new_password: str

# class ImageBackgroundSchema(BaseModel):
#     id: int
#     type: str
#     title: str
#     image: str

# class EditUserConfigSchema(BaseModel):
#     style: str
#     auteStyle: bool
#     staticBackground: bool

# class Message(BaseModel):
#     message: str

class StyleSchemas(BaseModel):
    name: str
    active: str
    c1: str
    c2: str
    icon: Optional[str]
    ok: str
    error: str

class StyleDeleteSchemas(BaseModel):
    name: str

