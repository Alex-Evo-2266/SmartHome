from pydantic import BaseModel
from typing import Optional

class UserForm(BaseModel):
    name: str
    password: str
    email: str

class UserSchema(BaseModel):
    id: str
    name: str
    email: Optional[str]
    role: str
    image_url: Optional[str]
    host: Optional[str]

class UserEditSchema(BaseModel):
    name: str
    email: Optional[str] = ""

class UserEditLevelSchema(BaseModel):
    id: str
    role: str

class UserEditPasswordSchema(BaseModel):
    old_password: str
    new_password: str