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
    image_id: Optional[int]
    auth_type: AuthType

class UserEditSchema(BaseModel):
    name: str
    email: Optional[str]
    image_id: Optional[int]

class UserDeleteSchema(BaseModel):
    id: int

class UserNameSchema(BaseModel):
    name: str

class UserEditLevelSchema(BaseModel):
    id: int
    role: UserLevel = UserLevel.BASE

class UserEditPasswordSchema(BaseModel):
    Old: str
    New: str

class ImageBackgroundSchema(BaseModel):
    id: int
    type: str
    title: str
    image: str

class MenuElementsSchema(BaseModel):
    id: Optional[int]
    title:str
    iconClass:str
    url:str

class UserConfigSchema(BaseModel):
    Style: str
    auteStyle: bool
    staticBackground: bool
    images: Optional[List[ImageBackgroundSchema]]
    page: str
    MenuElements: Optional[List[MenuElementsSchema]]

class EditUserConfigSchema(BaseModel):
    style: str
    auteStyle: bool
    staticBackground: bool

class Message(BaseModel):
    message: str
