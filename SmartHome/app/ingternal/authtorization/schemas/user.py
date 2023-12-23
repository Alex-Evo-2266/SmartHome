from pydantic import BaseModel
from typing import Optional
from app.ingternal.authtorization.schemas.authtorization import UserLevel, AuthType

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

class UserEditLevelSchema(BaseModel):
    id: int
    role: UserLevel = UserLevel.NONE

class UserEditPasswordSchema(BaseModel):
    old_password: str
    new_password: str