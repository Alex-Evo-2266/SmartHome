from pydantic import BaseModel
from typing import Optional, List

class UserForm(BaseModel):
    name: str
    password: str
    email: str
    mobile: str

class UserSchema(BaseModel):
    UserId: int
    UserName: str
    UserSurname: Optional[str]
    Mobile: Optional[str]
    Email: Optional[str]
    Level: int
    ImageId: Optional[int]

class UserEditSchema(BaseModel):
    UserName: str
    UserSurname: Optional[str]
    Mobile: Optional[str]
    Email: Optional[str]
    ImageId: Optional[int]

class UserDeleteSchema(BaseModel):
    UserId: int

class UserNameSchema(BaseModel):
    name: str

class UserEditLevelSchema(BaseModel):
    id: int
    level: int

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
