from pydantic import BaseModel
from typing import Optional, List

class UserForm(BaseModel):
    name: str
    password: str
    email: Optional[str] = ""

class UserSchema(BaseModel):
    id: str
    name: str
    email: Optional[str]
    role: str
    image_url: Optional[str] = None
    host: Optional[str] = None

class UserEditSchema(BaseModel):
    name: str
    email: Optional[str] = ""

class UserEditLevelSchema(BaseModel):
    id: str
    role: str

class UserEditPasswordSchema(BaseModel):
    old_password: str
    new_password: str

class UsersDataSchema(BaseModel):
    users: List[UserSchema]