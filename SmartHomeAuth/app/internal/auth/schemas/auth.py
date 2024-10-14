import datetime
from enum import Enum
from typing import List, Optional
from pydantic import BaseModel

class Login(BaseModel):
	name: str
	password: str
	
class Tokens(BaseModel):
	access: str
	refresh: str
	expires_at: datetime.datetime
	
class ResponseLogin(BaseModel):
	token: str
	expires_at: datetime.datetime
	id: int
	role: str

class TokenData(BaseModel):
    user_id: int
    user_level: str