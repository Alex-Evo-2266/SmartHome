from pydantic import BaseModel
from typing import Optional, List
from authtorization.models import AuthType

from authtorization.schema import UserLevel

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
    email: Optional[str]

class UserDeleteSchema(BaseModel):
    id: int

class UserNameSchema(BaseModel):
    name: str

class UserEditLevelSchema(BaseModel):
    id: int
    role: UserLevel = UserLevel.NONE

class UserEditPasswordSchema(BaseModel):
    old_password: str
    new_password: str

class ImageBackgroundSchema(BaseModel):
    id: int
    type: str
    title: str
    image: str

class EditUserConfigSchema(BaseModel):
    style: str
    auteStyle: bool
    staticBackground: bool

class Message(BaseModel):
    message: str
