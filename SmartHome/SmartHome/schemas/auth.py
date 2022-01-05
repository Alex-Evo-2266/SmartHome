from pydantic import BaseModel

class Login(BaseModel):
    name: str
    password: str

class Tokens(BaseModel):
    access: str
    refresh: str

class Token(BaseModel):
    token: str
